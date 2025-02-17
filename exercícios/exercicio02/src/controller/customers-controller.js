const Customer = require('../models/Customer');

const customerController = {
  // GET /customers
  index: async (req, res) => {
    const customers = await Customer.findAll();
    res.json(customers);
  },
  // POST /customers
  create: async (req, res) => {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res
          .status(400)
          .json({ message: 'Todos os campos são obrigatórios!' });
      }

      const newCustomer = await Customer.create({
        name,
        email,
      });

      res.status(201).json(newCustomer);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  // GET /customers/:id
  show: async (req, res) => {
    const { id } = req.params;

    const customer = await Customer.findById(id);
    if (!customer) {
      res.status(404).json({ message: 'Customer not found!' });
    }

    res.json(customer);
  },

  // PUT /customers/:id
  update: async (req, res) => {
    const { id } = req.params;
    const attributes = req.body;

    const customer = await Customer.update(id, attributes);

    if (customer === null) {
      return res.status(404).json({ message: 'Customer not found!' });
    }

    return res.json(customer);
  },
  // DELETE /customers/:id
  delete: async (req, res) => {
    const { id } = req.params;

    const customer = await Customer.delete(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found!' });
    }

    return res.status(200).json(customer);
  },
};

module.exports = customerController;
