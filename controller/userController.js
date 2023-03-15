const { User, Product, UserProduct, MyProduct, Transaction, sequelize } = require('../models');
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
        const payload = req.query.myAccount
        const id = verifyToken(payload).id
        try {
            const user = await User.findByPk(id);
            const account = await Transaction.findAll({
                where: {
                    UserId: user.id
                }
            })

            let bank = account.length > 0 ? 0 : null;
            const money = account.map(el => { return bank += Number(el.amount) })

            const me = {
                name: user.name,
                email: user.email,
                money: bank,
                role: user.role
            }


            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(me);
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



    // fungsi untuk menghapus user berdasarkan ID
    static async deleteUserById(req, res) {
        const payload = req.query.myAccount
        const id = verifyToken(payload).id
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
            },
            order: [['updatedAt', 'DESC']],
            include: [{
                model: User,
                attributes: ['name']
            }]
        }
        try {
            const myProd = await MyProduct.findAll(option)
            res.status(200).json(myProd)
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    static async buyProduct(req, res) {
        const accessToken = req.query.accessToken;
        const productId = req.query.productId;
        const quantity = req.query.quantity;

        let qty = Number(quantity);
        let pid = Number(productId);
        const id = verifyToken(accessToken).id;

        try {
            const foundProduct = await Product.findOne({
                where: {
                    id: pid,
                },
            });

            if (!foundProduct) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }

            const [myProd, created] = await MyProduct.findOrCreate({
                where: {
                    name: foundProduct.name,
                },
                defaults: {
                    userId: id,
                    name: foundProduct.name,
                    imgUrl: foundProduct.imgUrl,
                    price: foundProduct.price,
                    stock: qty,
                    priceSell: foundProduct.priceSell,
                    priceBuy: foundProduct.priceBuy,
                },
            });

            if (!created) {
                myProd.stock += qty;
                await myProd.save();
            } else {
                foundProduct.stock -= qty;
                if (foundProduct.stock === 0) { // check if stock is zero before save
                    await foundProduct.destroy();
                } else {
                    await foundProduct.save();
                }
            }

            res.status(200).json({
                message: 'Product successfully bought',
                product: foundProduct,
                myProduct: myProd,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async sellProduct(req, res) {
        try {
            const { accessToken, productName, quantity, myProductId } = req.query;
            const qty = Number(quantity);
            const userId = verifyToken(accessToken).id;
            const myProduct = await MyProduct.findByPk(myProductId);

            if (!myProduct) {
                throw new Error('MyProduct not found.');
            }

            const [product, craeted] = await Product.findOrCreate({
                where: { name: productName },
                defaults: {
                    name: myProduct.name,
                    imgUrl: myProduct.imgUrl,
                    price: myProduct.price,
                    priceBuy: myProduct.priceBuy,
                    priceSell: myProduct.priceSell,
                    stock: 0
                }
            });

            const updatedStock = product.stock + qty;

            await Promise.all([product.update({ stock: updatedStock }),
            myProduct.update({ stock: myProduct.stock - qty })]);

            if (myProduct.stock === 0) {
                await myProduct.destroy();
            }

            return res.status(200).json({ message: 'Successfully sold product.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Unable to sell product.' });
        }
    }

    static async proceedSell(req, res) {
        const payload = req.query.accessToken
        const id = verifyToken(payload).id

        try {
            await sequelize.transaction(async (transaction) => {

                const products = await MyProduct.findAll({
                    where: {
                        userId: id
                    }
                })

                const getTotalStock = products.reduce((acc, product) => acc + product.stock, 0)
                const getTotalSell = products.reduce((acc, product) => acc + product.priceSell, 0)
                const getTotalAmount = getTotalSell * getTotalStock
                const invoiceNum = Date.now() + products.length

                const user = await User.findByPk(id)

                // create a transaction
                const madePurchase = await Transaction.create({
                    UserId: id,
                    amount: getTotalAmount,
                    invoiceNumber: invoiceNum
                }, { transaction })
                const money = madePurchase.amount
                // update stock of all products
                const promisesForUpdateStocks = products.map(product => {
                    if (product.stock > 0) {
                        return product.decrement({ stock: product.stock }, { transaction })
                    } else {
                        return product.destroy({ transaction })
                    }
                })
                await Promise.all(promisesForUpdateStocks)
                res.status(200).json({ message: "Transaction made", madePurchase, money })
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }




}

module.exports = UserController
