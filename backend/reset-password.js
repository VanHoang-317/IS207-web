/**
 * FLUER - Script reset password cho user theo email
 *
 * Dùng khi quên password tài khoản, hoặc cần đặt lại password
 * cho tài khoản cũ trong DB.
 *
 * Cách dùng:
 *   node reset-password.js <email> <new_password>
 *
 * Ví dụ:
 *   node reset-password.js napiii2012@gmail.com Fluer@2026
 */

const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function resetPassword(email, newPassword) {
    if (!email || !newPassword) {
        console.error('Thieu tham so. Cach dung:');
        console.error('  node reset-password.js <email> <new_password>');
        process.exit(1);
    }

    if (newPassword.length < 6) {
        console.error('Password phai co it nhat 6 ky tu.');
        process.exit(1);
    }

    try {
        // Kiem tra user co ton tai khong
        const check = await pool.query(
            'SELECT id, email, role FROM users WHERE email = $1',
            [email]
        );

        if (check.rowCount === 0) {
            console.error(`Khong tim thay user voi email: ${email}`);
            process.exit(1);
        }

        // Hash password moi bang bcryptjs (cung thuat toan voi backend)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Update password_hash trong DB
        await pool.query(
            'UPDATE users SET password_hash = $1 WHERE email = $2',
            [passwordHash, email]
        );

        const user = check.rows[0];
        console.log('===========================================');
        console.log('Reset password THANH CONG');
        console.log('===========================================');
        console.log(`Email:    ${user.email}`);
        console.log(`User ID:  ${user.id}`);
        console.log(`Role:     ${user.role}`);
        console.log(`New PW:   ${newPassword}`);
        console.log('===========================================');
        console.log('Bay gio ban co the login bang password moi.');
    } catch (err) {
        console.error('Loi:', err.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

const [, , email, password] = process.argv;
resetPassword(email, password);
