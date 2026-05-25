const express = require('express');
const router = express.Router();

const {
    createSepayQR,
    sepayWebhook,
    checkStatus,
} = require('../controllers/paymentController');

const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/qr', authMiddleware, createSepayQR);
router.post('/webhook', sepayWebhook);
router.post('/ipn', sepayWebhook);

router.get('/status/:orderCode', checkStatus);

module.exports = router;
