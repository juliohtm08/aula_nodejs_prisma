/* 
    Order {
        id = 1,
        customerId = 1,
        total = 400,
        customer {
            id, name, email
        }
    }
*/

const { query, getClient } = require('../database');
const Product = require('./Product');

class Order {
  constructor(ordersRow, populateCustomer, populateProducts) {
    this.id = ordersRow.id;
    this.customerId = ordersRow.customer_id;
    this.total = ordersRow.total;
    this.CreatedAt = new Date(ordersRow.created_at);
    this.updatedAt = new Date(ordersRow.updated_at);

    this.customer = undefined;
    if (populateCustomer) {
      this.customer = populateCustomer;
    }

    this.products = undefined;
    if (populateProducts) {
      this.products = populateProducts;
    }
  }

  static async findAll() {
    const result = await query(`
        SELECT
            orders.*,
            customers.id AS "customer.id",
            customers.name AS "customer.name",
            customers.email AS "customer.email",
            customers.created_at AS "customer.created_at",
            customers.updated_at AS "customer.updated_at"
        FROM orders 
        JOIN customers ON customers.id = orders.customer_id;
    `);
    return result.rows.map((row) => new Order(row));
  }

  /**
   *
   *   @param { number } customerId
   *   @param {{ id: number, quantity: number }[]} orderProducts
   */
  static async create(customerId, orderProducts) {
    // Obtém os dados do produto a partir do seu id
    const storedOrderProducts = await query(
      `SELECT * FROM products WHERE id = ANY($1::[]);`,
      [orderProducts.map((product) => product.id)]
    );

    // Calcula o total de cada produto
    let orderTotal = 0;
    const populatedOrderProducts = storedOrderProducts.rows.map((row) => {
      const { quantity } = orderProducts.find(
        (product) => product.id === row.id
      );

      orderTotal += +row.price * quantity;
      return { product: new Product(row), quantity };
    });

    const dbClient = await getClient();
    let response;
    try {
      // inicia uma transação
      await dbClient.query('BEGIN');

      // salva o pedido
      const orderCreationResult = await dbClient.query(
        `INSERT INTO orders (customer_id, total) VALUES ($1, $2) RETURNING *;`,
        [customerId, orderTotal]
      );

      // instancia em um objeto
      const order = new Order(
        orderCreationResult.rows[0],
        null,
        populatedOrderProducts
      );

      // para cada produto que foi pedido irá inserir um anova linha na tabela order_products
      for (const entry of populatedOrderProducts) {
        await dbClient.query(
          `INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3);`,
          [order.id, entry.product.id, entry.quantity]
        );
      }

      // commita a transação
      await dbClient.query('COMMIT');
      response = order;
    } catch (error) {
      await dbClient.query('ROLLBACK');
      response = { message: `Error while creating order ${error.message}` };
    } finally {
      dbClient.release();
    }

    return response;
  }
}
