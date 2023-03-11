const express = require('express');
const UserController = require('../controller/userController')
const ProductController = require('../controller/productController');
const router = express.Router();

router.post('/login', UserController.login);

router.get("/users", UserController.getAllUsers);
router.post("/users", UserController.createUser);
router.get("/users/:id", UserController.getUserById);
router.put("/users/:id", UserController.updateUserById);
router.delete("/users/:id", UserController.deleteUserById);

//mengurangi stock melalui transaksi ?? sell
router.get("/users/:id/products/:productId", UserController.buyProduct);


router.get('/products', ProductController.readAllProd);
// menambah stock ?? buy
router.post('/products', ProductController.createProd);
router.get('/products/:id', ProductController.addStock);
router.delete('/products/:id', ProductController.deleteProd);




module.exports = router;

