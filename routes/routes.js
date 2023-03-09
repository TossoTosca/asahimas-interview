const express = require('express');
const UserController = require('../controller/userController')
const ProductController = require('../controller/productController');
const router = express.Router();

router.get('/login', UserController.login);

router.get("/users", UserController.getAllUsers);
router.post("/users", UserController.createUser);
router.get("/users/:id", UserController.getUserById);
router.put("/users/:id", UserController.updateUserById);
router.delete("/users/:id", UserController.deleteUserById);

//mengurangi stock melalui transaksi
router.get("/users/:id/products/:productId", UserController.buyProduct);


router.get('/products', ProductController.readAllProd);
// menambah stock
router.get('/products/:id', ProductController.addStock);



module.exports = router;

