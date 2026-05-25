const express = require('express');
const { authMiddleware, shipperMiddleware } = require('../middleware/authMiddleware');
const { getShipperOrders, getShipperOrderById, updateDeliveryStatus } = require('../controllers/shipperController');

const router = express.Router();

router.use(authMiddleware, shipperMiddleware);

router.get('/orders',          getShipperOrders);
router.get('/orders/:id',      getShipperOrderById);
router.put('/orders/:id/delivery', updateDeliveryStatus);

module.exports = router;
