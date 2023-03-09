const { Product } = require('../models');


class ProductController {
    static async readAllProd(req, res) {
        try {
            const data = await Product.findAll();
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async addStock(req, res) {
        try {
            const productId = req.params.productId;
            const { quantity } = req.body;

            const product = await Product.findByPk(productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const newStock = (product.stock + +quantity);

            await product.update({ stock: newStock });

            res.status(200).json({ message: 'Stock added successfully', product });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

};

module.exports = ProductController
