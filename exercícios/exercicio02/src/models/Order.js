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
const Customer = require('./Customer');
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
    return result.rows.map((row) => {
      const customer = new Customer({
        id: row['customer.id'],
        name: row['customer.name'],
        email: row['customer.email'],
        created_at: row['customer.created_at'],
        updated_at: row['customer.updated_at'],
      });
      return new Order(row, customer);
    });
  }

  /**
   *
   *   @param { number } customerId
   *   @param {{ id: number, quantity: number }[]} orderProducts
   */

  // Cria um novo pedido
  static async create(customerId, orderProducts) {
    // Obtém os dados do produto a partir do seu id
    const storedOrderProducts = await query(
      `SELECT * FROM products WHERE id = ANY($1::int[]);`,
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

    // retorna uma conexão direta(client) da pool de conexões
    const dbClient = await getClient();

    let response;
    try {
      // inicia uma transação
      await dbClient.query('BEGIN');

      // insere o pedido na tabela orders
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

      // para cada produto no pedido, insere uma nova linha na tabela order_products,
      // que relaciona o pedido aos produtos
      for (const entry of populatedOrderProducts) {
        await dbClient.query(
          `INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3);`,
          [order.id, entry.product.id, entry.quantity]
        );
      }

      // confirma a transação
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

  static async findById(id) {
    const orderResult = await query(
      `SELECT
            orders.*,
            customers.id AS "customer.id",
            customers.name AS "customer.name",
            customers.email AS "customer.email",
            customers.created_at AS "customer.created_at",
            customers.updated_at AS "customer.updated_at"
        FROM orders 
        JOIN customers ON customers.id = orders.customer_id
        WHERE orders.id = $1;`,
      [id]
    );
    const orderProductResult = await query(
      `SELECT order_products.*, products.*
      FROM order_products
      JOIN products ON order_products.product_id = products.id
      WHERE order_products.order_id = $1;`,
      [id]
    );

    const orderData = orderResult.rows[0];
    const customer = new Customer({
      id: orderData['customer.id'],
      name: orderData['customer.name'],
      email: orderData['customer.email'],
      created_at: orderData['customer.created_at'],
      updated_at: orderData['customer.updated_at'],
    });

    return new Order(orderData, customer, orderProductResult.rows);
  }

  static async delete(id) {
    const dbClient = await getClient();

    let result;
    try {
      await dbClient.query('BEGIN');
      await dbClient.query(`DELETE FROM order_products WHERE order_id = $1`, [
        id,
      ]);
      /* ao acionar este método, ele não irá funcionar de primeira, pois viola a restruição das FK, logo o mais adequado seria adicionar
        o CASCADE as tabelas relacionadas */
      await dbClient.query(`DELETE FROM orders WHERE id = $1;`, [id]);
      await dbClient.query('COMMIT');

      result = { message: 'Order deleted successfully' };
    } catch (error) {
      await dbClient.query('ROLLBACK');
      result = { message: 'Error while deleting order!' };
    } finally {
      dbClient.release();
    }
    return result;
  }
}

module.exports = Order;
