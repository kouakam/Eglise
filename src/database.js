const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'eglise',
    port: 5432
});

// Wrapper to mimic mysql2 promise interface [rows, fields]
const db = {
    query: async (text, params) => {
        const res = await pool.query(text, params);
        return [res.rows, res.fields];
    },
    end: () => pool.end()
};

module.exports = db;
