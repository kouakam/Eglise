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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des prédications (Sermons)
CREATE TABLE IF NOT EXISTS sermons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    preacher VARCHAR(100),
    series VARCHAR(100),
    video_url VARCHAR(255), -- ID Youtube ou URL
    audio_url VARCHAR(255),
    date_preached DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des ministères
CREATE TABLE IF NOT EXISTS ministries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    leader_name VARCHAR(100),
    image_url VARCHAR(255)
);

-- Données de test (Seed)
INSERT INTO events (title, description, date_event, location) VALUES 
('Culte du Dimanche', 'Louange et célébration', '2026-03-01 10:00:00', '2620 Rue Darveau, Québec'),
('Étude Biblique', 'Approfondissement des textes', '2026-03-04 19:00:00', 'Salle Polyvalente');

INSERT INTO sermons (title, preacher, date_preached, video_url) VALUES 
('La Fidélité de Dieu', 'Pasteur Marc', '2026-02-22', 'dQw4w9WgXcQ');
