
-- Création de la base de données
CREATE DATABASE IF NOT EXISTS eglise_duberger;
USE eglise_duberger;

-- Table des événements
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date_event DATETIME NOT NULL,
    location VARCHAR(255),
    image_url VARCHAR(255),
    category VARCHAR(50), -- e.g., 'Conférence', 'Musique', 'Communauté'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des prédications (Sermons)
CREATE TABLE IF NOT EXISTS sermons (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS ministries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    short_description VARCHAR(255),
    description TEXT,
    image_url VARCHAR(255),
    schedule VARCHAR(255) -- e.g., 'Vendredi 19h00'
);

-- Table de l'équipe (About)
CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    bio TEXT,
    image_url VARCHAR(255),
    display_order INT DEFAULT 0
);

-- Table FAQ (Contact)
CREATE TABLE IF NOT EXISTS faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 0
);

-- Table Groupes Maison
CREATE TABLE IF NOT EXISTS house_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    day_time VARCHAR(100),
    description VARCHAR(255)
);

-- SEED DATA --

-- Events
INSERT INTO events (title, description, date_event, location, category, image_url) VALUES 
('Conférence "Vivre l\'Espoir"', 'Une fin de semaine exceptionnelle avec notre invité spécial.', '2026-05-12 19:00:00', 'Auditorium Principal', 'Conférence', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'),
('Soirée Louange', 'Une soirée dédiée à la musique et à la prière, ouverte à tous.', '2026-05-18 19:00:00', 'Salle Annexe', 'Musique', NULL),
('Repas Communautaire', 'Apportez un plat à partager ! Un moment convivial pour mieux se connaître.', '2026-05-22 18:00:00', 'Cafétéria', 'Communauté', 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80');

-- Sermons
INSERT INTO sermons (title, preacher, series, date_preached, description, duration, video_url) VALUES 
('La Puissance de la Communauté', 'Pasteur Jean Dupont', 'Vivre Ensemble', '2026-05-24', 'Pourquoi avons-nous besoin les uns des autres pour grandir spirituellement ?', '35 min', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
('L\'art de l\'hospitalité', 'Marie-Claude Tremblay', 'Vie pratique', '2026-05-17', 'Accueillir comme Christ nous a accueillis.', '28 min', NULL),
('Série Romains : Introduction', 'Pasteur Jean Dupont', 'Étude Biblique', '2026-05-10', 'Contexte historique et thèmes principaux de l''épître aux Romains.', '45 min', NULL),
('Q&R : La prière', 'Équipe Pastorale', 'Questions', '2026-05-03', 'Réponses à vos questions sur la vie de prière.', '30 min', NULL);

-- Ministries
INSERT INTO ministries (name, short_description, description, image_url, schedule) VALUES 
('Cité Mômes', 'Pour les 0-12 ans', 'Chaque dimanche, nos équipes dévouées accueillent vos enfants dans un environnement sécuritaire et stimulant.', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1ef4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Dimanche 10h00'),
('Cité Jeunesse', 'Pour les Ados & Jeunes Adultes', 'Un espace vibrant pour poser ses questions, tisser des amitiés solides et vivre une foi qui a du sens aujourd''hui.', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Vendredi 19h00');

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

-- FAQ
INSERT INTO faqs (question, answer, display_order) VALUES 
('À quoi ressemble un culte typique ?', 'Nos rencontres durent environ 1h30. Elles commencent par un temps de musique (louange) contemporaine, suivi d''un message pratique basé sur la Bible. L''ambiance est décontractée et bienveillante.', 1),
('Comment s''habiller ?', 'Venez comme vous êtes ! Jeans, t-shirt, ou costume, l''important est que vous soyez à l''aise. Il n''y a pas de code vestimentaire.', 2),
('Y a-t-il un stationnement ?', 'Oui, nous disposons d''un stationnement gratuit à l''arrière du bâtiment. Il est également possible de se garer facilement dans les rues avoisinantes.', 3);
