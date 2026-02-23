const db = require('./src/database');

(async () => {
    try {
        console.log('Checking if table house_groups exists...');
        try {
            const [rows] = await db.query('SELECT * FROM house_groups');
            console.log('House groups count:', rows.length);
            if (rows.length === 0) {
                console.log('Inserting default house groups...');
                await db.query(`
                    INSERT INTO house_groups (name, day_time, description) 
                    VALUES 
                    ($1, $2, $3),
                    ($4, $5, $6),
                    ($7, $8, $9)`,
                    [
                        'Groupe Limoilou', 'Mardi 19h00', 'Étude biblique et partage autour d\'un café.',
                        'Groupe Sainte-Foy', 'Jeudi 19h30', 'Louange et prière pour les étudiants et jeunes pros.',
                        'Groupe Beauport', 'Mercredi 19h00', 'Pour les familles, avec garde d\'enfants incluse.'
                    ]
                );
                console.log('Inserted default groups.');
            }
        } catch (err) {
            console.error('Error selecting:', err.message);
            if (err.message.includes('relation "house_groups" does not exist')) {
                console.log('Creating table house_groups...');
                await db.query(`
                    CREATE TABLE IF NOT EXISTS house_groups (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                        day_time VARCHAR(100),
                        description VARCHAR(255)
                    );
                `);
                console.log('Table created.');

                console.log('Inserting default house groups...');
                await db.query(`
                    INSERT INTO house_groups (name, day_time, description) 
                    VALUES 
                    ($1, $2, $3),
                    ($4, $5, $6),
                    ($7, $8, $9)`,
                    [
                        'Groupe Limoilou', 'Mardi 19h00', 'Étude biblique et partage autour d\'un café.',
                        'Groupe Sainte-Foy', 'Jeudi 19h30', 'Louange et prière pour les étudiants et jeunes pros.',
                        'Groupe Beauport', 'Mercredi 19h00', 'Pour les familles, avec garde d\'enfants incluse.'
                    ]
                );
                console.log('Inserted default groups.');
            } else {
                 throw err;
            }
        }
    } catch (err) {
        console.error('Final Error:', err);
    } finally {
        // Pool is managed by 'pg' inside db wrapper which exports query. 
        // Force exit since db.end() might not be exposed properly or we just want a quick script.
        process.exit();
    }
})();
