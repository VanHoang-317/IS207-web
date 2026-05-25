const { pool } = require('../config/db');

const normalizePaymentRef = (paymentRef) =>
    String(paymentRef || '').trim().toUpperCase();

const normalizeShippingAddress = (shippingAddress) => {
    if (!shippingAddress) return null;

    if (typeof shippingAddress === 'string') {
        return { fullAddress: shippingAddress.trim() };
    }

    if (typeof shippingAddress === 'object') {
        return shippingAddress;
    }

    return null;
};

const createOrder = async (
    userId,
    totalAmount,
    shippingAddress,
    items,
    status = 'pending',
    paymentId = null,
    paymentRef = null,
    paymentMethod = 'cod',
    deliveryStatus = 'not_started'
) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const addressPayload = normalizeShippingAddress(shippingAddress);

        const orderQuery = `
            INSERT INTO orders (user_id, total_amount, shipping_address, status, payment_id, payment_ref, payment_method, delivery_status)
            VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8)
            RETURNING id, created_at, status, payment_method, delivery_status;
        `;

        const orderResult = await client.query(orderQuery, [
            userId,
            totalAmount,
            JSON.stringify(addressPayload),
            status,
            paymentId,
            paymentRef ? normalizePaymentRef(paymentRef) : null,
            paymentMethod,
            deliveryStatus,
        ]);

        const order = orderResult.rows[0];

        const itemQuery = `
    INSERT INTO order_items (order_id, product_id, product_name, quantity, price, image) -- Thêm cột image
    VALUES ($1, $2, $3, $4, $5, $6) -- Thêm $6 ở đây
`;

for (const item of items) {
    await client.query(itemQuery, [
        order.id,
        item.product_id,
        item.product_name || null,
        item.quantity,
        item.price,
        item.image || null // Giữ nguyên 6 tham số
    ]);
}

        await client.query('COMMIT');
        return order;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const updatePaymentRef = async (orderId, paymentRef) => {
    const query = 'UPDATE orders SET payment_ref = $1 WHERE id = $2';
    return pool.query(query, [normalizePaymentRef(paymentRef), orderId]);
};

const getOrderByPaymentRef = async (paymentRef) => {
    const normalizedRef = normalizePaymentRef(paymentRef);

    if (!normalizedRef) return null;

    const result = await pool.query(
        'SELECT * FROM orders WHERE UPPER(TRIM(payment_ref)) = $1 LIMIT 1',
        [normalizedRef]
    );

    return result.rows[0] || null;
};

const updateOrderStatusByPaymentRef = async (paymentRef) => {
    const normalizedRef = normalizePaymentRef(paymentRef);

    const result = await pool.query(
        `UPDATE orders
         SET status = 'paid', payment_status = 'paid', delivery_status = 'waiting'
         WHERE UPPER(TRIM(payment_ref)) = $1
         RETURNING *`,
        [normalizedRef]
    );

    return result.rows[0] || null;
};

const getOrderById = async (id) => {
    const query = `
        SELECT
            o.*,
            json_agg(
                json_build_object(
                    'id', oi.id,
                    'order_id', oi.order_id,
                    'product_id', oi.product_id,
                    'product_name', oi.product_name,
                    'quantity', oi.quantity,
                    'price', oi.price,
                    'image', p.images[1]
                )
            ) AS items,
            u.name AS user_name,
            u.email AS user_email
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON p.id::text = oi.product_id
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = $1
        GROUP BY o.id, u.name, u.email;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};

const getOrdersByUser = async (userId) => {
    const query = `
        SELECT o.*, json_agg(oi.*) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

const getAllOrders = async () => {
    const query = `
        SELECT o.*, json_agg(oi.*) as items, u.name as user_name
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN users u ON o.user_id = u.id
        GROUP BY o.id, u.name
        ORDER BY o.created_at DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

const updateOrderStatus = async (id, status, paymentId = null, trackingId = null) => {
    let query = 'UPDATE orders SET status = $1';
    const values = [status];
    let idx = 2;

    if (paymentId) {
        query += `, payment_id = $${idx++}`;
        values.push(paymentId);
    }

    if (trackingId) {
        query += `, tracking_id = $${idx++}`;
        values.push(trackingId);
    }

    query += ` WHERE id = $${idx} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = {
    createOrder,
    getOrderById,
    getOrderByPaymentRef,
    updateOrderStatusByPaymentRef,
    updatePaymentRef,
    getOrdersByUser,
    getAllOrders,
    updateOrderStatus,
};
