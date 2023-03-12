const { User, Product, UserProduct, sequelize } = require('../models');
const { compare } = require('../helpers/bcrypt');
const { genPayload } = require('../helpers/jwt');


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


    // fungsi untuk menampilkan semua user
    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
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


    ///transacion
    static async buyProduct(req, res) {
        const { id, productId } = req.params;
        const { quantity, perintah } = req.body;

        try {
            await sequelize.transaction(async (t) => {
                const user = await User.findByPk(id, { transaction: t });
                const product = await Product.findByPk(productId, { transaction: t });

                let qty = Number(quantity);
                let uid = Number(id);
                let pid = Number(productId);

                if (perintah === "jual") {
                    if (product.stock >= qty) {
                        product.stock -= qty;
                    } else {
                        throw new Error('Insufficient stock');
                    }
                } else if (perintah === "beli") {
                    product.stock += qty;
                } else {
                    throw new Error('Invalid command');
                }

                const histori = await product.save({ transaction: t });

                const createUP = await UserProduct.create(
                    { UserId: uid, ProductId: pid },
                    { transaction: t }
                );

                createUP.UserId = Number(createUP.userId);
                createUP.ProductId = Number(createUP.productId);

                res.json({ message: 'Product purchase/sale successful', histori, createUP, user, qty });
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to purchase/sell product' });
        }
    }

}

// ekspor fungsi-fungsi yang dibutuhkan
module.exports = UserController
