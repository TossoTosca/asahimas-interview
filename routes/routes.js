const express = require('express');
const productController = require('../controller/productController');
const router = express.Router();

router.get('/',)
router.get('/products', productController.readAllProd);


module.exports = router;

