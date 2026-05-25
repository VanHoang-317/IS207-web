const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { getStats, listUsers, changeUserRole, confirmPayment } = require('../controllers/adminController');
const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', getStats);
router.get('/users', listUsers);
router.put('/users/:id/role', changeUserRole);
router.put('/orders/:id/confirm-payment', confirmPayment);

module.exports = router;
