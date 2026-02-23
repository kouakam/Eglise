const db = require('../src/database');

async function migrate() {
    try {
        console.log('Adding category column to sermons table...');
        
        // Add column if not exists
        await db.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sermons' AND column_name='category') THEN 
                    ALTER TABLE sermons ADD COLUMN category VARCHAR(50) DEFAULT 'Enseignements'; 
                END IF; 
            END $$;
        `);

        // Update existing rows randomly for demo purposes or set default
        console.log('Updating existing sermons with categories...');
        
        // Let's set some default categories based on titles or just random for now
        // Or just default to 'Enseignements' which we did in DEFAULT
        
        // Update some to 'Cultes' and 'Événements' for variety
        await db.query(`UPDATE sermons SET category = 'Cultes' WHERE id % 3 = 0`);
        await db.query(`UPDATE sermons SET category = 'Événements' WHERE id % 3 = 1`);
        // Remaining (id % 3 = 2) will be 'Enseignements' (default)

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();