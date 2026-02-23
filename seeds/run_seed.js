const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const schemaPath = path.join(__dirname, 'full_schema.sql');

async function seedDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'eglise_duberger',
            multipleStatements: true // Important for running the SQL file
        });

        console.log('Connected to database.');

        const sql = fs.readFileSync(schemaPath, 'utf8');
        
        // Split by statement won't work perfectly with comments, so using multipleStatements is key,
        // but it might fail on individual errors. 
        // For robustness, let's just run the whole thing.
        // Or better, let's just execute the file content.
        
        await connection.query(sql);

        console.log('Database seeded successfully!');
        await connection.end();
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

seedDatabase();
