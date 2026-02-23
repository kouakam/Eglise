
-- Suppression des tables si elles existent (pour repartir à zéro)
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS sermons CASCADE;
DROP TABLE IF EXISTS ministries CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS church_values CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS house_groups CASCADE;

-- Table des événements
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date_event TIMESTAMP NOT NULL,
    location VARCHAR(255),
    image_url VARCHAR(255),
    category VARCHAR(50), -- e.g., 'Conférence', 'Musique', 'Communauté'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des prédications (Sermons)
CREATE TABLE sermons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    preacher VARCHAR(100),
    series VARCHAR(100),
    video_url VARCHAR(255), 
    audio_url VARCHAR(255),
    date_preached DATE,
    description TEXT,
    duration VARCHAR(20), -- e.g., '45 min'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des ministères
CREATE TABLE ministries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    short_description VARCHAR(255),
    description TEXT,
    image_url VARCHAR(255),
    schedule VARCHAR(255) -- e.g., 'Vendredi 19h00'
);

-- Table de l'équipe (About)
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    bio TEXT,
    image_url VARCHAR(255),
    display_order INT DEFAULT 0
);

-- Table des Valeurs (About)
CREATE TABLE church_values (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- e.g., 'ph-heart'
    display_order INT DEFAULT 0
);

-- Table FAQ (Contact)
CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 0
);

-- Table Groupes Maison
CREATE TABLE house_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    day_time VARCHAR(100),
    description VARCHAR(255)
);

-- SEED DATA --

-- Events
INSERT INTO events (title, description, date_event, location, category, image_url) VALUES 
('Conférence "Vivre l''Espoir"', 'Une fin de semaine exceptionnelle avec notre invité spécial.', '2026-05-12 19:00:00', 'Auditorium Principal', 'Conférence', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'),
('Soirée Louange', 'Une soirée dédiée à la musique et à la prière, ouverte à tous.', '2026-05-18 19:00:00', 'Salle Annexe', 'Musique', NULL),
('Repas Communautaire', 'Apportez un plat à partager ! Un moment convivial pour mieux se connaître.', '2026-05-22 18:00:00', 'Cafétéria', 'Communauté', 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80');

-- Sermons
INSERT INTO sermons (title, preacher, series, date_preached, description, duration, video_url) VALUES 
('La Puissance de la Communauté', 'Pasteur Jean Dupont', 'Vivre Ensemble', '2026-05-24', 'Pourquoi avons-nous besoin les uns des autres pour grandir spirituellement ?', '35 min', 'https://www.youtube.com/embed/SjVz-X1c4N8'), -- Community
('L''art de l''hospitalité', 'Marie-Claude Tremblay', 'Vie pratique', '2026-05-17', 'Accueillir comme Christ nous a accueillis.', '28 min', 'https://www.youtube.com/embed/eCn_MUEQGZ4'), -- Hospitality
('Série Romains : Introduction', 'Pasteur Jean Dupont', 'Étude Biblique', '2026-05-10', 'Contexte historique et thèmes principaux de l''épître aux Romains.', '45 min', 'https://www.youtube.com/embed/K6f6_vVp9T0'), -- Bible Study
('Q&R : La prière', 'Équipe Pastorale', 'Questions', '2026-05-03', 'Réponses à vos questions sur la vie de prière.', '30 min', 'https://www.youtube.com/embed/BiqR9pS1JpE'), -- Prayer
('La Joie du Service', 'David Lavoie', 'Vie chrétienne', '2026-04-26', 'Servir Dieu avec joie et passion au quotidien.', '40 min', 'https://www.youtube.com/embed/Mo-jK1Jp8uI'), -- Service
('La Foi dans l''Epreuve', 'Pasteur Jean Dupont', 'Les Psaumes', '2026-04-19', 'Trouver un refuge en Dieu quand tout va mal.', '38 min', 'https://www.youtube.com/embed/g8JtlpDgQYk'), -- Faith/Worship
('Pâques : Il est Vivant !', 'Pasteur Jean Dupont', 'Fêtes', '2026-04-12', 'Célébration de la résurrection du Christ.', '50 min', 'https://www.youtube.com/embed/YZqE29D-iTU'), -- Easter
('Vendredi Saint', 'Pasteur Jean Dupont', 'Fêtes', '2026-04-10', 'Méditation sur la croix et le sacrifice ultime.', '30 min', 'https://www.youtube.com/embed/0g3a5q3j-9U'), -- Good Friday
('Les Paraboles : Le Semeur', 'Marie-Claude Tremblay', 'Les Paraboles', '2026-04-05', 'Quel type de terre est votre cœur ?', '32 min', 'https://www.youtube.com/embed/w7yGLMvT2j8'), -- Parables
('Les Paraboles : Le Bon Samaritain', 'Pasteur Jean Dupont', 'Les Paraboles', '2026-03-29', 'Qui est mon prochain ? Une question toujours actuelle.', '35 min', 'https://www.youtube.com/embed/osfQgPqFpDw'), -- Good Samaritan
('Vivre par l''Esprit', 'David Lavoie', 'Pneumatologie', '2026-03-22', 'La marche quotidienne avec le Saint-Esprit.', '42 min', 'https://www.youtube.com/embed/J3vXpnV1g-0'), -- Holy Spirit
('La Générosité Biblique', 'Pasteur Jean Dupont', 'Intendance', '2026-03-15', 'Comprendre les principes de la gestion financière selon Dieu.', '36 min', 'https://www.youtube.com/embed/N-8qGg0r-1c'), -- Generosity
('L''Importance de la Louange', 'David Lavoie', 'Adoration', '2026-03-08', 'Pourquoi chantons-nous ? Le cœur de l''adoration.', '45 min', 'https://www.youtube.com/embed/nQWFzMvCfLE'), -- Worship
('Étude de Jean 3:16', 'Pasteur Jean Dupont', 'Textes Fondateurs', '2026-03-01', 'L''amour de Dieu manifesté pour le monde.', '30 min', 'https://www.youtube.com/embed/L1v7hZ-g5-g'), -- John 3:16
('La Mission de l''Église', 'Pasteur Jean Dupont', 'Ecclésiologie', '2026-02-23', 'Pourquoi l''église existe-t-elle ?', '40 min', 'https://www.youtube.com/embed/Hu5vPq0k1c0'), -- Church Mission
('Gérer les Conflits', 'Marie-Claude Tremblay', 'Relations', '2026-02-16', 'Principes bibliques pour la résolution de conflits.', '35 min', 'https://www.youtube.com/embed/wXgN9tM-1-w'), -- Conflict
('L''Espérance Chrétienne', 'Pasteur Jean Dupont', 'Eschatologie', '2026-02-09', 'Attendre le retour du Christ avec confiance.', '38 min', 'https://www.youtube.com/embed/6i5-1j-1-0w'), -- Hope
('La Sagesse des Proverbes', 'David Lavoie', 'Sagesse', '2026-02-02', 'Conseils pratiques pour la vie de tous les jours.', '33 min', 'https://www.youtube.com/embed/Xy3xM5d-0sU'), -- Wisdom (PROVERBS)
('Jésus et les Enfants', 'Marie-Claude Tremblay', 'Évangiles', '2026-01-26', 'L''importance des plus petits dans le royaume.', '25 min', 'https://www.youtube.com/embed/t817pU8g-c0'), -- Jesus & Children
('Le Sermon sur la Montagne : Partie 1', 'Pasteur Jean Dupont', 'Matthieu', '2026-01-19', 'Les béatitudes et le bonheur selon Jésus.', '40 min', 'https://www.youtube.com/embed/3K3q3_E7_Kk'), -- Beatitudes
('Le Sermon sur la Montagne : Partie 2', 'Pasteur Jean Dupont', 'Matthieu', '2026-01-12', 'Le sel et la lumière du monde.', '42 min', 'https://www.youtube.com/embed/5D3v3-1-1-1'), -- Salt and Light
('Vision 2026', 'Pasteur Jean Dupont', 'Vision', '2026-01-05', 'Ce que Dieu a en réserve pour nous cette année.', '50 min', 'https://www.youtube.com/embed/V6-1-1-1-1'), -- Vision (Generic Church Vision)
('Culte de Noël', 'Équipe Pastorale', 'Fêtes', '2025-12-25', 'Célébration de la naissance du Sauveur.', '60 min', 'https://www.youtube.com/embed/_J-1-1-1-1'), -- Christmas Service
('Avent : La Paix', 'David Lavoie', 'Fêtes', '2025-12-21', 'Le Prince de la Paix est venu.', '35 min', 'https://www.youtube.com/embed/P-1-1-1-1-1'), -- Advent Peace
('Avent : La Joie', 'Marie-Claude Tremblay', 'Fêtes', '2025-12-14', 'Un sujet de grande joie pour tout le peuple.', '30 min', 'https://www.youtube.com/embed/J-1-1-1-1-1'); -- Advent Joy


-- Ministries
INSERT INTO ministries (name, short_description, description, image_url, schedule) VALUES 
('Cité Mômes', 'Pour les 0-12 ans', 'Chaque dimanche, nos équipes dévouées accueillent vos enfants dans un environnement sécuritaire et stimulant.', 'https://picsum.photos/seed/kids/800/600', 'Dimanche 10h00'),
('Cité Jeunesse', 'Pour les Ados & Jeunes Adultes', 'Un espace vibrant pour poser ses questions, tisser des amitiés solides et vivre une foi qui a du sens aujourd''hui.', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Vendredi 19h00'),
('Louange & Adoration', 'Un cœur pour Dieu', 'Une équipe passionnée qui conduit l''église dans la présence de Dieu par la musique et le chant.', 'https://images.unsplash.com/photo-1510915361408-d8a5762a4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Jeudi 19h30 (Répétition)'),
('Action Sociale', 'Aimer son prochain', 'Distribution alimentaire, aide aux démunis et présence dans le quartier pour témoigner de l''amour de Christ en action.', 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Samedi 10h00'),
('Femmes de Destinée', 'Inspirer & Encourager', 'Des temps de partage, de prière et d''enseignement spécifiques pour encourager les femmes dans leur identité.', 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', '1er Samedi du mois'),
('Hommes d''Honneur', 'Force & Caractère', 'Se retrouver entre hommes pour relever les défis de la vie quotidienne avec foi et intégrité.', 'https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', '3ème Samedi du mois');

-- House Groups
INSERT INTO house_groups (name, day_time, description) VALUES
('Sainte-Foy', 'Mardi 19h30', 'Étude biblique et prière.'),
('Limoilou', 'Mercredi 19h00', 'Partage convivial et repas.'),
('Beauport', 'Jeudi 19h30', 'Discussion thématique.'),
('Centre-Ville', 'Mercredi 18h30', 'Groupe Étudiants & Jeunes Pro.');

-- Team
INSERT INTO team_members (name, role, bio, image_url, display_order) VALUES
('Jean Dupont', 'Pasteur Principal', 'Passionné par l''enseignement biblique et le discipulat.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1),
('Marie-Claude Tremblay', 'Responsable Enfance', 'Une vision pour voir les enfants grandir dans la foi.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 2),
('David Lavoie', 'Responsable Louange', 'Musicien talentueux au service de l''église.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 3);

-- Values
INSERT INTO church_values (title, description, icon, display_order) VALUES
('L''Accueil Inconditionnel', 'Nous croyons que l''Église doit être le lieu le plus accueillant de la ville. Vous êtes aimés avant même d''être connus.', 'ph-heart', 1),
('La Bible au Centre', 'Nous explorons les textes bibliques avec sérieux et humilité, cherchant à appliquer leur sagesse dans notre quotidien moderne.', 'ph-book-open', 2),
('La Vie Communautaire', 'La foi ne se vit pas en solo. Nous privilégions les relations authentiques et l''entraide pratique.', 'ph-users-three', 3);

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
