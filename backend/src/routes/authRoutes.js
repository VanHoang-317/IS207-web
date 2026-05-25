const express = require('express');
const { body } = require('express-validator');
const { register, login, updateProfile, changePassword } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required').escape(),
    body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
], register);

router.post('/login', [
    body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    body('password').exists().withMessage('Password must be provided'),
], login);

router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, changePassword);

module.exports = router;
