const Product = require('../models/Product');

const productsController = {
  // GET /products
  index: async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
  },

  // POST /products
  create: async (req, res) => {
    /* Maneira mais adequada
      const newProduct = await Product.create({ name, description, price,stockQuantity, isActive }); 
    */

    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  },

  // GET /products/:id
  show: async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product === null) {
      return res.status(404).json({ message: 'Product not found!' });
    }
    res.json(product);
  },

  // UPDATE /products/:id
  update: async (req, res) => {
    const updatedProduct = await Product.update(req.params.id, req.body);

    if (updatedProduct === null) {
      return res.status(404).json({ message: 'Product not found!' });
    }
    res.json(updatedProduct);
  },

  // DELETE /products/:id
  delete: async (req, res) => {
    const { id } = req.params;

    const deletedProduct = await Product.delete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found!' });
    }
    res.status(200).json(deletedProduct);
  },
};

module.exports = productsController;
