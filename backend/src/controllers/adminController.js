const { pool } = require('../config/db');
const { getAllUsers, updateUserRole } = require('../models/userModel');

const getStats = async (req, res, next) => {
    try {
        const [revenueResult, ordersResult, productsResult, usersResult, topProductsResult] = await Promise.all([
            pool.query(`SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE status IN ('paid', 'delivered')`),
            pool.query(`SELECT status, COUNT(*) AS count FROM orders GROUP BY status`),
            pool.query(`SELECT COUNT(*) AS count FROM products`),
            pool.query(`SELECT COUNT(*) AS count FROM users`),
            pool.query(`
                SELECT p.id, p.name, p.images, SUM(oi.quantity) AS total_sold
                FROM order_items oi
                JOIN products p ON p.id::text = oi.product_id
                JOIN orders o ON o.id = oi.order_id
                WHERE o.status IN ('paid', 'delivered')
                GROUP BY p.id, p.name, p.images
                ORDER BY total_sold DESC
                LIMIT 5
            `),
        ]);

        const orderStats = { total: 0, pending: 0, paid: 0, shipped: 0, delivered: 0, cancelled: 0 };
        ordersResult.rows.forEach(row => {
            orderStats[row.status] = parseInt(row.count);
            orderStats.total += parseInt(row.count);
        });

        res.json({
            totalRevenue: parseFloat(revenueResult.rows[0].total),
            orders: orderStats,
            totalProducts: parseInt(productsResult.rows[0].count),
            totalUsers: parseInt(usersResult.rows[0].count),
            topProducts: topProductsResult.rows,
        });
    } catch (err) {
        next(err);
    }
};

const listUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

const changeUserRole = async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;
    const allowed = ['customer', 'admin', 'shipper'];
    if (!allowed.includes(role)) {
        return res.status(400).json({ message: 'Role không hợp lệ' });
    }
    try {
        const updated = await updateUserRole(id, role);
        if (!updated) return res.status(404).json({ message: 'User không tồn tại' });
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// Admin xác nhận thanh toán online → delivery_status = waiting
const confirmPayment = async (req, res, next) => {
    const { id } = req.params;
    try {
        const orderCheck = await pool.query('SELECT payment_method, payment_status FROM orders WHERE id = $1', [id]);
        if (!orderCheck.rows[0]) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        const { payment_method, payment_status } = orderCheck.rows[0];
        if (payment_status === 'paid') return res.status(400).json({ message: 'Đơn hàng đã được xác nhận thanh toán' });

        const result = await pool.query(`
            UPDATE orders
            SET payment_status  = 'paid',
                delivery_status = 'waiting',
                status          = 'paid'
            WHERE id = $1
            RETURNING *
        `, [id]);

        res.json({ message: 'Xác nhận thanh toán thành công', order: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

module.exports = { getStats, listUsers, changeUserRole, confirmPayment };
