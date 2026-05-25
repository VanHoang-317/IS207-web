const { pool } = require('../config/db');

const createUser = async (name, email, passwordHash, role = 'customer') => {
    const query = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at;
  `;
    const values = [name, email, passwordHash, role];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

const findUserById = async (id) => {
    const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const updateUser = async (id, { name, email }) => {
    const query = `
        UPDATE users SET name=$1, email=$2
        WHERE id=$3
        RETURNING id, name, email, role, created_at;
    `;
    const result = await pool.query(query, [name, email, id]);
    return result.rows[0];
};

const updatePassword = async (id, newPasswordHash) => {
    await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [newPasswordHash, id]);
};

const getAllUsers = async () => {
    const result = await pool.query(
        'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
};

const updateUserRole = async (id, role) => {
    const result = await pool.query(
        'UPDATE users SET role=$1 WHERE id=$2 RETURNING id, name, email, role',
        [role, id]
    );
    return result.rows[0];
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser,
    updatePassword,
    getAllUsers,
    updateUserRole,
};
