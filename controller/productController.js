const { verifyToken } = require('../helpers/jwt');
const { Product, History } = require('../models');


class ProductController {

    // fungsi untuk membuat produk baru, make sure on check input form in fe.
    static async createProd(req, res) {
        try {
            const accessToken = req.query.accessToken
            const id = verifyToken(accessToken).id
            console.log(id)
            const newProd = await History.create({ ...req.body, userId: id });
            console.log(newProd)
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

};

module.exports = ProductController
