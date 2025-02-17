const { Router } = require('express');
const customerController = require('./controller/customers-controller');

const router = Router();

router.get('/customers', customerController.index);
router.get('/customers/:id', customerController.show);
router.post('/customers', customerController.create);
router.put('/customers/:id', customerController.update);
router.delete('/customers/:id', customerController.delete);

module.exports = router;
