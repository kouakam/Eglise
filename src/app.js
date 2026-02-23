const express = require('express');
const path = require('path');
const db = require('./database');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { isAuthenticated, setUserLocals } = require('./middleware/auth');

const app = express();

// Configuration du moteur de vue EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Servir les fichiers statiques (CSS, Images, JS client)
app.use(express.static(path.join(__dirname, '../public')));

// Middleware pour parser les données des formulaires
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_change_in_prod',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// User locals middleware
app.use(setUserLocals);

// Middleware pour charger les ministères pour le footer (et partout ailleurs)
app.use(async (req, res, next) => {
    try {
        const [ministries] = await db.query('SELECT id, name FROM ministries ORDER BY id ASC LIMIT 4'); // Limite à 4 pour vérifier s'il y en a plus de 3
        res.locals.footerMinistries = ministries;
        next();
    } catch (err) {
        console.error("Erreur chargement ministères footer:", err);
        res.locals.footerMinistries = [];
        next();
    }
});

// --- ROUTES ---

// Login Page
app.get('/login', (req, res) => {
    res.render('login', { currentPage: 'login', error: null });
});

// Login Process
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (users.length > 0) {
            const user = users[0];
            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                req.session.userId = user.id;
                req.session.username = user.username;
                req.session.role = user.role;
                return res.redirect('/');
            }
        }
        res.render('login', { currentPage: 'login', error: 'Nom d\'utilisateur ou mot de passe incorrect' });
    } catch (err) {
        console.error(err);
        res.render('login', { currentPage: 'login', error: 'Une erreur est survenue' });
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// Accueil
app.get('/', async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM events WHERE date_event >= CURRENT_DATE ORDER BY date_event ASC LIMIT 3');
        const [ministries] = await db.query('SELECT * FROM ministries LIMIT 3');
        const [sermons] = await db.query('SELECT * FROM sermons ORDER BY date_preached DESC LIMIT 1');
        
        res.render('index', { 
            currentPage: 'home',
            events: events,
            ministries: ministries,
            latestSermon: sermons[0]
        });
    } catch (err) {
        console.error(err);
        res.render('index', { currentPage: 'home', events: [], ministries: [], latestSermon: null });
    }
});

// A Propos
app.get('/about', async (req, res) => {
    try {
        const [team] = await db.query('SELECT * FROM team_members ORDER BY display_order ASC');
        const [values] = await db.query('SELECT * FROM church_values ORDER BY display_order ASC');
        res.render('about', { 
            currentPage: 'about',
            team: team,
            churchValues: values
        });
    } catch (err) {
        console.error(err);
        res.render('about', { currentPage: 'about', team: [], churchValues: [] });
    }
});

// --- ROUTES CRUD VALEURS (Values) ---

// --- ROUTES CRUD SERMONS (Media) ---

// Formulaire Nouveau Sermon (Admin seulement)
app.get('/sermons/new', isAuthenticated, (req, res) => {
    res.render('sermon-form', { 
        currentPage: 'media',
        sermon: {} 
    });
});

// Créer un sermon (Admin seulement)
app.post('/sermons/create', isAuthenticated, async (req, res) => {
    const { title, preacher, series, video_url, audio_url, date_preached, description, duration, category } = req.body;
    try {
        await db.query(
            'INSERT INTO sermons (title, preacher, series, video_url, audio_url, date_preached, description, duration, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [title, preacher, series, video_url, audio_url, date_preached, description, duration, category || 'Enseignements']
        );
        res.redirect('/media');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la création du sermon");
    }
});

// Formulaire Modifier Sermon (Admin seulement)
app.get('/sermons/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM sermons WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).send("Sermon non trouvé");
        }
        res.render('sermon-form', { 
            currentPage: 'media',
            sermon: rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors du chargement");
    }
});

// Mettre à jour un sermon (Admin seulement)
app.post('/sermons/update/:id', isAuthenticated, async (req, res) => {
    const { title, preacher, series, video_url, audio_url, date_preached, description, duration, category } = req.body;
    try {
        await db.query(
            'UPDATE sermons SET title = $1, preacher = $2, series = $3, video_url = $4, audio_url = $5, date_preached = $6, description = $7, duration = $8, category = $9 WHERE id = $10',
            [title, preacher, series, video_url, audio_url, date_preached, description, duration, category || 'Enseignements', req.params.id]
        );
        res.redirect('/media');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la mise à jour");
    }
});

// Supprimer un sermon (Admin seulement)
app.post('/sermons/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await db.query('DELETE FROM sermons WHERE id = $1', [req.params.id]);
        res.redirect('/media');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la suppression");
    }
});

// Formulaire Nouvelle Valeur (Admin seulement)
app.get('/values/new', isAuthenticated, (req, res) => {
    res.render('value-form', { 
        currentPage: 'about',
        valueItem: {} 
    });
});

// Créer une valeur (Admin seulement)
app.post('/values/create', isAuthenticated, async (req, res) => {
    const { title, description, icon, display_order } = req.body;
    try {
        await db.query(
            'INSERT INTO church_values (title, description, icon, display_order) VALUES ($1, $2, $3, $4)',
            [title, description, icon, display_order || 0]
        );
        res.redirect('/about#values');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la création de la valeur");
    }
});

// Formulaire Modifier Valeur (Admin seulement)
app.get('/values/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM church_values WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).send("Valeur non trouvée");
        }
        res.render('value-form', { 
            currentPage: 'about',
            valueItem: rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors du chargement");
    }
});

// Mettre à jour une valeur (Admin seulement)
app.post('/values/update/:id', isAuthenticated, async (req, res) => {
    const { title, description, icon, display_order } = req.body;
    try {
        await db.query(
            'UPDATE church_values SET title = $1, description = $2, icon = $3, display_order = $4 WHERE id = $5',
            [title, description, icon, display_order || 0, req.params.id]
        );
        res.redirect('/about#values');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la mise à jour");
    }
});

// Supprimer une valeur (Admin seulement)
app.post('/values/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await db.query('DELETE FROM church_values WHERE id = $1', [req.params.id]);
        res.redirect('/about#values');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la suppression");
    }
});

// --- ROUTES CRUD TEAM ---

// Formulaire Nouveau Membre (Admin seulement)
app.get('/team/new', isAuthenticated, (req, res) => {
    res.render('team-form', { 
        currentPage: 'about',
        member: {} 
    });
});

// Créer un membre (Admin seulement)
app.post('/team/create', isAuthenticated, async (req, res) => {
    const { name, role, bio, image_url, display_order } = req.body;
    try {
        await db.query(
            'INSERT INTO team_members (name, role, bio, image_url, display_order) VALUES ($1, $2, $3, $4, $5)',
            [name, role, bio, image_url, display_order || 0]
        );
        res.redirect('/about');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la création du membre");
    }
});

// Formulaire Modifier Membre (Admin seulement)
app.get('/team/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM team_members WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).send("Membre non trouvé");
        }
        res.render('team-form', { 
            currentPage: 'about',
            member: rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors du chargement");
    }
});

// Mettre à jour un membre (Admin seulement)
app.post('/team/update/:id', isAuthenticated, async (req, res) => {
    const { name, role, bio, image_url, display_order } = req.body;
    try {
        await db.query(
            'UPDATE team_members SET name = $1, role = $2, bio = $3, image_url = $4, display_order = $5 WHERE id = $6',
            [name, role, bio, image_url, display_order || 0, req.params.id]
        );
        res.redirect('/about');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la mise à jour");
    }
});

// Supprimer un membre (Admin seulement)
app.post('/team/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await db.query('DELETE FROM team_members WHERE id = $1', [req.params.id]);
        res.redirect('/about');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la suppression");
    }
});

// Ministères
app.get('/ministries', async (req, res) => {
    try {
        const [ministries] = await db.query('SELECT * FROM ministries ORDER BY id ASC');
        const [groups] = await db.query('SELECT * FROM house_groups');
        res.render('ministries', { 
            currentPage: 'ministries',
            ministries: ministries,
            houseGroups: groups
        });
    } catch (err) {
        console.error(err);
        res.render('ministries', { currentPage: 'ministries', ministries: [], houseGroups: [] });
    }
});

// Formulaire Nouveau Ministère (Admin seulement)
app.get('/ministries/new', isAuthenticated, (req, res) => {
    res.render('ministry-form', { 
        currentPage: 'ministries',
        ministry: {} // Objet vide pour le mode création
    });
});

// Créer un ministère (Admin seulement)
app.post('/ministries/create', isAuthenticated, async (req, res) => {
    const { name, short_description, description, image_url, schedule } = req.body;
    try {
        await db.query(
            'INSERT INTO ministries (name, short_description, description, image_url, schedule) VALUES ($1, $2, $3, $4, $5)',
            [name, short_description, description, image_url, schedule]
        );
        res.redirect('/ministries');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la création du ministère");
    }
});

// Formulaire Modifier Ministère (Admin seulement)
app.get('/ministries/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ministries WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).send("Ministère non trouvé");
        }
        res.render('ministry-form', { 
            currentPage: 'ministries',
            ministry: rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors du chargement");
    }
});

// Mettre à jour un ministère (Admin seulement)
app.post('/ministries/update/:id', isAuthenticated, async (req, res) => {
    const { name, short_description, description, image_url, schedule } = req.body;
    try {
        await db.query(
            'UPDATE ministries SET name = $1, short_description = $2, description = $3, image_url = $4, schedule = $5 WHERE id = $6',
            [name, short_description, description, image_url, schedule, req.params.id]
        );
        res.redirect('/ministries');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la mise à jour");
    }
});

// Supprimer un ministère (Admin seulement)
app.post('/ministries/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await db.query('DELETE FROM ministries WHERE id = $1', [req.params.id]);
        res.redirect('/ministries');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la suppression");
    }
});

// Prédications (Media)
app.get('/media', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const category = req.query.category;
        const limit = 9;

        // Requête pour le featured (le plus récent, filtré ou non)
        let featuredQuery = 'SELECT * FROM sermons';
        let featuredParams = [];
        if (category) {
            featuredQuery += ' WHERE category = $1';
            featuredParams.push(category);
        }
        featuredQuery += ' ORDER BY date_preached DESC LIMIT 1';
        const [featured] = await db.query(featuredQuery, featuredParams);
        const featuredSermon = featured.length > 0 ? featured[0] : null;

        // Calcul de l'offset : on saute le featured s'il existe
        const offset = (page - 1) * limit + (featuredSermon ? 1 : 0);

        // Requête pour la liste principale
        let sermonsQuery = 'SELECT * FROM sermons';
        let countQuery = 'SELECT COUNT(*) as total FROM sermons';
        let sermonsParams = [];
        let countParams = [];

        if (category) {
            sermonsQuery += ' WHERE category = $1';
            countQuery += ' WHERE category = $1';
            sermonsParams.push(category);
            countParams.push(category); // Pour le count
        }
        
        sermonsQuery += ` ORDER BY date_preached DESC LIMIT $${sermonsParams.length + 1} OFFSET $${sermonsParams.length + 2}`;
        sermonsParams.push(limit, offset);

        const [sermons] = await db.query(sermonsQuery, sermonsParams);
        const [countResult] = await db.query(countQuery, countParams);
        
        const totalSermons = parseInt(countResult[0].total);
        // Soustraire 1 au total seulement si on a un featured, pour la pagination
        const totalPages = Math.ceil((totalSermons - (featuredSermon ? 1 : 0)) / limit) || 1;

        res.render('media', { 
            currentPage: 'media',
            featuredSermon: featuredSermon,
            recentSermons: sermons,
            currentPaginationPage: page,
            totalPages: totalPages,
            currentCategory: category
        });
    } catch (err) {
        console.error(err);
        res.render('media', { 
            currentPage: 'media', 
            featuredSermon: null, 
            recentSermons: [], 
            currentPaginationPage: 1, 
            totalPages: 1,
            currentCategory: null
        });
    }
});

// Événements
app.get('/events', async (req, res) => {
    try {
        const view = req.query.view || 'list'; // 'list' or 'month'
        const [events] = await db.query('SELECT * FROM events ORDER BY date_event ASC');
        res.render('events', { 
            currentPage: 'events',
            events: events,
            currentView: view
        });
    } catch (err) {
        console.error(err);
        res.render('events', { currentPage: 'events', events: [], currentView: 'list' });
    }
});

// Formulaire Nouvel Événement (Admin seulement)
app.get('/events/new', isAuthenticated, (req, res) => {
    res.render('event-form', { 
        currentPage: 'events',
        event: {} // Objet vide pour le mode création
    });
});

// Créer un événement (Admin seulement)
app.post('/events/create', isAuthenticated, async (req, res) => {
    const { title, date_event, description, location, category, image_url } = req.body;
    try {
        await db.query(
            'INSERT INTO events (title, date_event, description, location, category, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
            [title, date_event, description, location, category, image_url]
        );
        res.redirect('/events');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la création");
    }
});

// Formulaire Modifier Événement (Admin seulement)
app.get('/events/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).send("Événement non trouvé");
        }
        res.render('event-form', { 
            currentPage: 'events',
            event: rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors du chargement");
    }
});

// Mettre à jour un événement (Admin seulement)
app.post('/events/update/:id', isAuthenticated, async (req, res) => {
    const { title, date_event, description, location, category, image_url } = req.body;
    try {
        await db.query(
            'UPDATE events SET title = $1, date_event = $2, description = $3, location = $4, category = $5, image_url = $6 WHERE id = $7',
            [title, date_event, description, location, category, image_url, req.params.id]
        );
        res.redirect('/events');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la mise à jour");
    }
});

// Supprimer un événement (Admin seulement)
app.post('/events/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await db.query('DELETE FROM events WHERE id = $1', [req.params.id]);
        res.redirect('/events');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la suppression");
    }
});

// Détail d'un événement
app.get('/events/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).render('404', { currentPage: '404' });
        }
        res.render('event-detail', { 
            currentPage: 'events', 
            event: rows[0] 
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { currentPage: 'error' });
    }
});

// FAQ CRUD
app.get('/faqs/create', isAuthenticated, (req, res) => {
    res.render('faq-form', { faq: {}, currentPage: 'contact' });
});

app.post('/faqs/create', isAuthenticated, async (req, res) => {
    const { question, answer, display_order } = req.body;
    try {
        await db.query('INSERT INTO faqs (question, answer, display_order) VALUES ($1, $2, $3)', [question, answer, display_order || 0]);
        res.redirect('/contact');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la création de la FAQ');
    }
});

app.get('/faqs/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM faqs WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).send('FAQ non trouvée');
        res.render('faq-form', { faq: rows[0], currentPage: 'contact' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

app.post('/faqs/update/:id', isAuthenticated, async (req, res) => {
    const { question, answer, display_order } = req.body;
    try {
        await db.query('UPDATE faqs SET question = $1, answer = $2, display_order = $3 WHERE id = $4', [question, answer, display_order || 0, req.params.id]);
        res.redirect('/contact');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la mise à jour');
    }
});

app.post('/faqs/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await db.query('DELETE FROM faqs WHERE id = $1', [req.params.id]);
        res.redirect('/contact');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la suppression');
    }
});

// Contact
app.get('/contact', async (req, res) => {
    try {
        const [faqs] = await db.query('SELECT * FROM faqs ORDER BY display_order ASC');
        res.render('contact', { 
            currentPage: 'contact',
            faqs: faqs,
            success: req.query.success === 'true'
        });
    } catch (err) {
        console.error(err);
        res.render('contact', { currentPage: 'contact', faqs: [], success: false });
    }
});

// Traitement du formulaire de contact
app.post('/contact/send', async (req, res) => {
    const { prenom, nom, email, sujet, message } = req.body;
    try {
        await db.query(`
            INSERT INTO contact_messages (first_name, last_name, email, subject, message)
            VALUES ($1, $2, $3, $4, $5)
        `, [prenom, nom, email, sujet, message]);
        
        // Ici on pourrait ajouter l'envoi d'email via Nodemailer
        
        res.redirect('/contact?success=true');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de l'envoi du message");
    }
});

// Admin - Liste des messages
app.get('/admin/messages', isAuthenticated, async (req, res) => {
    try {
        const [messages] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.render('admin-messages', { 
            currentPage: 'admin',
            messages: messages 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

// Admin - Détail d'un message
app.get('/admin/messages/:id', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM contact_messages WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).send("Message non trouvé");
        }
        
        // Marquer comme lu automatiquement à l'ouverture ? (Optionnel, demandons à l'user sinon on laisse manuel)
        // Pour l'instant on garde manuel pour éviter les accidents de lecture automatique, ou alors on fait un update silencieux.
        // On va faire un update silencieux pour marquer comme lu si c'est non lu.
        if (!rows[0].read) {
            await db.query('UPDATE contact_messages SET read = true WHERE id = $1', [req.params.id]);
            rows[0].read = true; // Mettre à jour l'objet pour l'affichage
        }

        res.render('admin-message-detail', { 
            currentPage: 'admin',
            message: rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

// Admin - Marquer comme lu/non lu
app.post('/admin/messages/toggle-read/:id', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT read FROM contact_messages WHERE id = $1', [req.params.id]);
        if (rows.length > 0) {
            const newState = !rows[0].read;
            await db.query('UPDATE contact_messages SET read = $1 WHERE id = $2', [newState, req.params.id]);
        }
        res.redirect('/admin/messages');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

// Admin - Supprimer un message
app.post('/admin/messages/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await db.query('DELETE FROM contact_messages WHERE id = $1', [req.params.id]);
        res.redirect('/admin/messages');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la suppression");
    }
});

// Faire un don
app.get('/give', (req, res) => {
    res.render('give', { currentPage: 'give' });
});

// Redirection index.html vers /
app.get('/index.html', (req, res) => {
    res.redirect('/');
});


// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
