const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const schemaPath = path.join(__dirname, 'postgres_schema.sql');

async function seedDatabase() {
    let pool;
    console.log(`Connecting to Postgres on ${process.env.DB_HOST}:${process.env.DB_PORT || 5432} as ${process.env.DB_USER}...`);
    
    // 1. Connect to default 'postgres' database to create the target database if it doesn't exist
    const defaultPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: 'postgres',
        port:  parseInt(process.env.DB_PORT || '5432', 10)
    });

    const dbName = process.env.DB_NAME || 'eglise';

    try {
        const res = await defaultPool.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
        if (res.rowCount === 0) {
            console.log(`Database '${dbName}' does not exist. Creating it...`);
            await defaultPool.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database '${dbName}' created.`);
        } else {
            console.log(`Database '${dbName}' already exists.`);
        }
    } catch (e) {
        console.error('Error checking/creating database:', e);
        if (e.code === '28P01') {
             console.error('Authentication failed. Check your password.');
        }
    } finally {
        await defaultPool.end();
    }

    // 2. Connect to the target database and seed
    try {
        pool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            database: dbName,
            port: parseInt(process.env.DB_PORT || '5432', 10)
        });

        console.log(`Connected to database '${dbName}'. Seeding...`);

        // Read the SQL file
        const sql = fs.readFileSync(schemaPath, 'utf8');

        // Execute the SQL script
        await pool.query(sql);

        console.log('Database seeded successfully!');

    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        if (pool) await pool.end();
    }
}

seedDatabase();