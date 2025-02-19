const { Router } = require('express');
const customerController = require('./controller/customers-controller');
const productsController = require('./controller/products-controller');
const ordersController = require('./controller/orders-controller');

const router = Router();

// rota de produtos
router.get('/products', productsController.index);
router.get('/products/:id', productsController.show);
router.post('/products', productsController.create);
router.put('/products/:id', productsController.update);
router.delete('/products/:id', productsController.delete);

// rota de clientes
router.get('/customers', customerController.index);
router.get('/customers/:id', customerController.show);
router.post('/customers', customerController.create);
router.put('/customers/:id', customerController.update);
router.delete('/customers/:id', customerController.delete);

// rota de pedidos
router.get('/orders', ordersController.index);
router.post('/orders', ordersController.create);
router.get('/orders/:id', ordersController.show);
router.delete('/orders/:id', ordersController.delete);

module.exports = router;
