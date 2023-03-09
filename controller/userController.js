const { User, Product } = require('../models'); // import model User



class UserController {
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
        const { userId } = req.params;
        const { productId, quantity } = req.body;

        try {
            // Mulai transaksi
            await sequelize.transaction(async (t) => {
                // Ambil data user
                const user = await User.findByPk(userId, { transaction: t });

                // Ambil data produk
                const product = await Product.findByPk(productId, { transaction: t });

                // Kurangi stok produk
                if (product.stock >= quantity) {
                    product.stock -= quantity;
                    await product.save({ transaction: t });

                    // Tambahkan data pembelian ke tabel UserProduct
                    await UserProduct.create(
                        { userId, productId, quantity },
                        { transaction: t }
                    );

                    res.json({ message: 'Product purchased successfully' });
                } else {
                    throw new Error('Insufficient stock');
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to purchase product' });
        }
    }
}

// ekspor fungsi-fungsi yang dibutuhkan
module.exports = UserController
