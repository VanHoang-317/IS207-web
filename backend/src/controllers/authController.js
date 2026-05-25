const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { createUser, findUserByEmail, findUserById, updateUser, updatePassword } = require('../models/userModel');

const register = async (req, res, next) => {
    // 1. Check for input validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await createUser(name, email, passwordHash);

        const token = jwt.sign(
            { id: newUser.id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    // 1. Check for input validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Tên và email là bắt buộc' });
    try {
        const existing = await findUserByEmail(email);
        if (existing && existing.id !== req.user.id) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }
        const updated = await updateUser(req.user.id, { name, email });
        res.json({ user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role } });
    } catch (err) {
        next(err);
    }
};

const changePassword = async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }
    try {
        const user = await findUserById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        await updatePassword(req.user.id, hash);
        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    updateProfile,
    changePassword,
};
