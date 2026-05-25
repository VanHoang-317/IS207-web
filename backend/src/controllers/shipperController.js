const { pool } = require('../config/db');

// Lấy danh sách đơn hàng cần giao cho Shipper
// Hiển thị nếu: (online + paid) HOẶC (cod) VÀ delivery_status IN (waiting, delivering)
const getShipperOrders = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT
                o.*,
                u.name  AS customer_name,
                u.email AS customer_email,
                json_agg(
                    json_build_object(
                        'id',           oi.id,
                        'product_id',   oi.product_id,
                        'product_name', oi.product_name,
                        'quantity',     oi.quantity,
                        'price',        oi.price,
                        'image',        oi.image
                    ) ORDER BY oi.id
                ) AS items
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE (
                (o.payment_method = 'online' AND o.payment_status = 'paid')
                OR o.payment_method = 'cod'
            )
            AND o.delivery_status IN ('waiting', 'delivering')
            AND o.status != 'cancelled'
            GROUP BY o.id, u.name, u.email
            ORDER BY
                CASE o.delivery_status
                    WHEN 'delivering' THEN 1
                    WHEN 'waiting'    THEN 2
                END,
                o.created_at ASC
        `);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

// Lấy chi tiết 1 đơn hàng (Shipper view)
const getShipperOrderById = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT
                o.*,
                u.name  AS customer_name,
                u.email AS customer_email,
                json_agg(
                    json_build_object(
                        'id',           oi.id,
                        'product_id',   oi.product_id,
                        'product_name', oi.product_name,
                        'quantity',     oi.quantity,
                        'price',        oi.price,
                        'image',        oi.image
                    ) ORDER BY oi.id
                ) AS items
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.id = $1
            GROUP BY o.id, u.name, u.email
        `, [req.params.id]);

        if (!result.rows[0]) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

// Cập nhật trạng thái giao hàng bởi Shipper
const updateDeliveryStatus = async (req, res, next) => {
    const { id } = req.params;
    const { delivery_status } = req.body;

    const allowed = ['delivering', 'delivered', 'failed'];
    if (!allowed.includes(delivery_status)) {
        return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    try {
        let extraSets = '';
        const values = [delivery_status, req.user.id, id];

        if (delivery_status === 'delivering') {
            // Shipper nhận đơn → đang giao
            extraSets = `, status = 'shipped'`;
        } else if (delivery_status === 'delivered') {
            // Giao thành công
            extraSets = `, status = 'delivered', delivered_at = NOW()`;
            // Nếu COD → tự động coi là đã thanh toán
            const order = await pool.query('SELECT payment_method FROM orders WHERE id = $1', [id]);
            if (order.rows[0]?.payment_method === 'cod') {
                extraSets += `, payment_status = 'paid'`;
            }
        } else if (delivery_status === 'failed') {
            // Giao thất bại → trả lại waiting để giao lại
            extraSets = `, status = 'shipped'`;
        }

        const result = await pool.query(
            `UPDATE orders
             SET delivery_status = $1, shipper_id = $2 ${extraSets}
             WHERE id = $3
             RETURNING *`,
            values
        );

        if (!result.rows[0]) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        res.json({ message: 'Cập nhật thành công', order: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

module.exports = { getShipperOrders, getShipperOrderById, updateDeliveryStatus };
