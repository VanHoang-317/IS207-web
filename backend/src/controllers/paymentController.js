const orderModel = require('../models/orderModel');

const BANK_CODE = process.env.SEPAY_BANK_CODE || 'TPBank';
const ACCOUNT_NUMBER = process.env.SEPAY_ACCOUNT_NUMBER || '10003956555';
const ACCOUNT_NAME = process.env.SEPAY_ACCOUNT_NAME || 'LE VAN HOANG';
const WEBHOOK_SECRET = process.env.SEPAY_WEBHOOK_SECRET || '';

const ORDER_CODE_REGEX = /FLEUR[A-Z0-9]+/i;

const normalize = (value) => String(value || '').trim().toUpperCase();

const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const extractOrderCode = (payload = {}) => {
    const candidates = [
        payload.code,
        payload.content,
        payload.description,
        payload.data?.code,
        payload.data?.content,
        payload.data?.description,
    ];

    for (const candidate of candidates) {
        if (!candidate || typeof candidate !== 'string') continue;

        const normalized = normalize(candidate);
        const match = normalized.match(ORDER_CODE_REGEX);

        if (match) {
            return match[0];
        }
    }

    return null;
};

const extractPaidAmount = (payload = {}) =>
    toNumber(payload.transferAmount) ??
    toNumber(payload.amount) ??
    toNumber(payload.order?.order_amount) ??
    toNumber(payload.transaction?.transaction_amount);

const createSepayQR = async (req, res) => {
    try {
        const { amount, items, shippingAddress } = req.body;
        const userId = req.user.id;

        const finalAmount = Math.round(Number(amount));

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Danh sach san pham khong hop le' });
        }

        if (
            !shippingAddress ||
            (typeof shippingAddress !== 'string' && typeof shippingAddress !== 'object')
        ) {
            return res.status(400).json({ message: 'Dia chi giao hang khong hop le' });
        }

        if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
            return res.status(400).json({ message: 'So tien thanh toan khong hop le' });
        }

        const normalizedShippingAddress =
            typeof shippingAddress === 'string'
                ? shippingAddress.trim()
                : shippingAddress;

        const order = await orderModel.createOrder(
            userId,
            finalAmount,
            normalizedShippingAddress,
            items,
            'pending',
            null,
            null
        );

        const orderCode = `FLEUR${order.id.split('-')[0].toUpperCase()}`;

        await orderModel.updatePaymentRef(order.id, orderCode);

        const qrUrl =
            `https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NUMBER}-qr_only.png` +
            `?amount=${finalAmount}` +
            `&addInfo=${encodeURIComponent(orderCode)}` +
            `&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

        return res.status(201).json({
            qrUrl,
            orderCode,
            orderId: order.id,
            amount: finalAmount,
            accountNumber: ACCOUNT_NUMBER,
            accountName: ACCOUNT_NAME,
        });
    } catch (err) {
        console.error('SePay QR error:', err);
        return res.status(500).json({
            message: 'Khong the tao ma thanh toan SePay',
            detail: err.message,
        });
    }
};

const checkStatus = async (req, res) => {
    try {
        const orderCode = normalize(req.params.orderCode);

        if (!orderCode) {
            return res.status(400).json({ message: 'Thieu ma don hang' });
        }

        const order = await orderModel.getOrderByPaymentRef(orderCode);

        if (!order) {
            return res.status(404).json({ message: 'Khong tim thay don hang' });
        }

        return res.json({
            status: order.status,
            orderId: order.id,
        });
    } catch (err) {
        console.error('Check status error:', err);
        return res.status(500).json({ message: 'Loi kiem tra trang thai thanh toan' });
    }
};

const sepayWebhook = async (req, res) => {
    try {
        if (WEBHOOK_SECRET) {
            const receivedSecret = req.get('X-Secret-Key');

            if (receivedSecret !== WEBHOOK_SECRET) {
                return res.status(401).json({ success: false, message: 'Invalid webhook secret' });
            }
        }

        if (String(req.body.transferType || '').toLowerCase() !== 'in') {
            return res.status(200).json({ success: true, ignored: true });
        }

        const orderCode = extractOrderCode(req.body);

        if (!orderCode) {
            return res.status(200).json({ success: true, ignored: true });
        }

        const order = await orderModel.getOrderByPaymentRef(orderCode);

        if (!order) {
            return res.status(200).json({ success: true, ignored: true });
        }

        const paidAmount = extractPaidAmount(req.body);
        const expectedAmount = toNumber(order.total_amount);

        if (
            paidAmount !== null &&
            expectedAmount !== null &&
            Math.round(paidAmount) !== Math.round(expectedAmount)
        ) {
            return res.status(200).json({ success: true, ignored: true });
        }

        await orderModel.updateOrderStatusByPaymentRef(orderCode);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('SePay webhook error:', err);
        return res.status(500).json({ success: false, message: 'Webhook processing failed' });
    }
};

module.exports = {
    createSepayQR,
    sepayWebhook,
    checkStatus,
};
