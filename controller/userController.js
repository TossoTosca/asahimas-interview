const { User, Product, UserProduct, History, sequelize } = require('../models');
const { compare } = require('../helpers/bcrypt');
const { genPayload, verifyToken } = require('../helpers/jwt');



class UserController {
    // fungsi untuk login
    static async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) throw new Error('Invalid email or password');

            const isPasswordMatch = compare(password, user.password);
            if (!isPasswordMatch) throw new Error('Invalid email or password');

            const payload = { id: user.id, email: user.email };
            const accessToken = genPayload(payload);

            res.status(200).json({ accessToken });
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message });
        }
    }


    // fungsi untuk menampilkan detail user berdasarkan ID
    static async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // fungsi untuk membuat user baru
    static async createUser(req, res) {
        const { name, email, password, role } = req.body;
        try {
            const user = await User.create({ name, email, password, role });
            res.status(201).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // fungsi untuk mengupdate data user berdasarkan ID
    static async updateUserById(req, res) {
        const { id } = req.params;
        const { name, email, password, role } = req.body;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const updatedUser = await user.update({ name, email, password, role });
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // fungsi untuk menghapus user berdasarkan ID
    static async deleteUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await user.destroy();
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getMyProduct(req, res) {
        const payload = req.query.hereForYou
        const userId = verifyToken(payload).id

        let option = {
            where: {
                userId
            }
        }
        try {
            const myProd = await History.findAll(option)
            res.status(200).json(myProd)
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    ///transacion
    static async buyProduct(req, res) {
        const accessToken = req.query.accessToken;
        const productId = req.query.productId;
        const quantity = req.query.quantity;


        let qty = Number(quantity);
        let pid = Number(productId);
        const id = verifyToken(accessToken).id

        try {
            await sequelize.transaction(async (t) => {
                const user = await User.findByPk(id, { transaction: t });
                const product = await Product.findByPk(productId, { transaction: t });


                if (product.stock <= qty) {
                    return res.status(400).json({ message: 'stock kurang dari qty yang diminta' })
                }

                product.stock -= qty;

                const updatedProduct = await product.save({ transaction: t });

                const [history, created] = await History.findOrCreate({
                    where: { userId: id, name: product.name },
                    defaults: {
                        imgUrl: product.imgUrl,
                        name: product.name,
                        price: product.price,
                        stock: qty,
                        priceSell: product.priceSell,
                        priceBuy: product.priceBuy
                    }
                });

                if (history) {
                    await History.update({
                        imgUrl: history.imgUrl = updatedProduct.imgUrl,
                        name: history.name = updatedProduct.name,
                        price: history.price = updatedProduct.price,
                        stock: history.stock + qty,
                        priceSell: history.priceSell = updatedProduct.priceSell,
                        priceBuy: history.priceBuy = updatedProduct.priceBuy
                    }, {
                        where: { id: history.id }
                    })
                }

                await Product.destroy({ where: { stock: 0 } });

                const createUP = await UserProduct.create(
                    { UserId: id, ProductId: pid },
                    { transaction: t }
                );

                createUP.UserId = Number(createUP.userId);
                createUP.ProductId = Number(createUP.productId);

                res.json({ message: 'Product purchase successful', updatedProduct, history });
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to purchase product' });
        }
    }


    // sell product 
    static async sellProduct(req, res) {
        const accessToken = req.query.accessToken;
        const productName = req.query.productName;
        const quantity = req.query.quantity;
        const historyId = req.query.historyId


        let qty = Number(quantity);
        const id = verifyToken(accessToken).id;
        let hid = Number(historyId)

        try {
            await sequelize.transaction(async (t) => {
                const user = await User.findByPk(id, { transaction: t });
                const product = await Product.findOne({ where: { name: productName } }, { transaction: t });

                const findUserProd = await History.findOne({ where: { id: hid } });

                if (findUserProd.dataValues.stock <= qty) {
                    return res.status(400).json({ message: 'stock kurang dari qty yang diminta' })
                }

                if (findUserProd.dataValues.name !== product.dataValues.name) {
                    return res.status(400).json({ message: 'product di web dan milik user berbeda!' })
                }

                await History.update({ stock: findUserProd.dataValues.stock - qty }, { where: { id: hid } });
                await Product.update({ stock: product.dataValues.stock + qty }, { where: { name: productName } });



                const updatedProduct = await product.save({ transaction: t });
                const updatedHistory = await findUserProd.dataValues

                await Product.destroy({ where: { stock: 0 } });

                const createUP = await UserProduct.create(
                    { UserId: id, ProductId: product.dataValues.id },
                    { transaction: t }
                );

                createUP.UserId = Number(createUP.userId);
                createUP.ProductId = Number(createUP.productId);

                res.json({ message: 'Product sale successful', updatedProduct, updatedHistory });
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to sell product' });
        }
    }


}

module.exports = UserController
