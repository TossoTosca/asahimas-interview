const { Product } = require('../models');


class ProductController {

    // fungsi untuk membuat produk baru
    static async createProd(req, res) {
        const { imgUrl, name, price, priceBuy, priceSell, stock } = req.body;
        try {
            const newProd = await Product.create({ imgUrl, name, price, priceBuy, priceSell, stock });
            res.status(201).json(newProd);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // fungsi untuk menghapus produk
    static async deleteProd(req, res) {
        const { id } = req.params;
        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            await product.destroy();
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

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
