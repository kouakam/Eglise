const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: connectionString ? connectionString : undefined,
    host: connectionString ? undefined : (process.env.DB_HOST || 'localhost'),
    user: connectionString ? undefined : (process.env.DB_USER || 'postgres'),
    password: connectionString ? undefined : (process.env.DB_PASSWORD || ''),
    database: connectionString ? undefined : (process.env.DB_NAME || 'eglise'),
    port: connectionString ? undefined : 5432,
    ssl: isProduction ? { rejectUnauthorized: false } : false
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
