const { pool } = require('../config/db');

const validateCoupon = async (req, res, next) => {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Vui lòng nhập mã giảm giá' });

    try {
        const result = await pool.query(
            `SELECT * FROM coupons WHERE UPPER(code) = UPPER($1)`,
            [code.trim()]
        );
        const coupon = result.rows[0];

        if (!coupon) return res.status(404).json({ message: 'Mã giảm giá không tồn tại' });
        if (!coupon.is_active) return res.status(400).json({ message: 'Mã giảm giá đã hết hiệu lực' });

        const now = new Date();
        if (coupon.end_date && new Date(coupon.end_date) < now) {
            return res.status(400).json({ message: 'Mã giảm giá đã hết hạn' });
        }
        if (coupon.start_date && new Date(coupon.start_date) > now) {
            return res.status(400).json({ message: 'Mã giảm giá chưa có hiệu lực' });
        }
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
        }
        if (cartTotal < parseFloat(coupon.min_cart_value || 0)) {
            return res.status(400).json({
                message: `Đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN').format(coupon.min_cart_value)}đ để dùng mã này`,
            });
        }

        let discountAmount = 0;
        if (coupon.discount_type === 'percentage') {
            discountAmount = (cartTotal * parseFloat(coupon.discount_value)) / 100;
            if (coupon.max_discount) {
                discountAmount = Math.min(discountAmount, parseFloat(coupon.max_discount));
            }
        } else {
            discountAmount = parseFloat(coupon.discount_value);
        }
        discountAmount = Math.min(discountAmount, cartTotal);

        res.json({
            valid: true,
            couponId: coupon.id,
            code: coupon.code,
            discountType: coupon.discount_type,
            discountValue: parseFloat(coupon.discount_value),
            discountAmount: Math.round(discountAmount),
            message: `Áp dụng thành công! Giảm ${coupon.discount_type === 'percentage' ? coupon.discount_value + '%' : new Intl.NumberFormat('vi-VN').format(coupon.discount_value) + 'đ'}`,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { validateCoupon };
