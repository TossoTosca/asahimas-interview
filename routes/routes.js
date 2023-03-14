const express = require('express');
const UserController = require('../controller/userController')
const ProductController = require('../controller/productController');
const router = express.Router();

router.post('/login', UserController.login);

router.post("/users", UserController.createUser);
router.get("/users", UserController.getUserById);
router.delete("/users", UserController.deleteUserById);


//mengurangi stock product melalui penjulan dari web ke user ,butuh req body quantity
router.get("/buyProduct", UserController.buyProduct);
//menambahkan stock product dengan menjual milik user ke webapp, butuh req body quantity
router.get("/sellProduct", UserController.sellProduct);

//mengambil query product yg dimiliki user 
router.get("/myProduct", UserController.getMyProduct)

router.get('/products', ProductController.readAllProd);
router.post('/products', ProductController.createProd);
//meminta admin menghapus produk dari web app
router.delete('/products/:id', ProductController.deleteProd);




module.exports = router;

