-- Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT,
    auth_provider VARCHAR(50) DEFAULT 'email', -- email, google, linkedin
    role VARCHAR(20) DEFAULT 'user', -- user, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);