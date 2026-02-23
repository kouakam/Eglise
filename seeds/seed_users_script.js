const db = require('../src/database');

const query = `
-- Users (Security)
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed User (admin / password123)
-- Hash generated via bcrypt: $2b$10$d4ItJTK1Fl79uyxwo7nJjO3TX3jNHppp6SQuR89SlAPzttyDP9gua
INSERT INTO users (username, password_hash, role) VALUES 
('admin', '$2b$10$d4ItJTK1Fl79uyxwo7nJjO3TX3jNHppp6SQuR89SlAPzttyDP9gua', 'admin');
`;

async function runSchema() {
    try {
        console.log('Running user schema migration...');
        await db.query(query);
        console.log('User schema created and seeded successfully.');
    } catch (err) {
        console.error('Error migrating user schema:', err);
    } finally {
        process.exit();
    }
}

runSchema();
