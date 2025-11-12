-- psql -h 127.0.0.1 -p 5432 -U postgres -d monitoring


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    fingerprint TEXT UNIQUE NOT NULL
);


CREATE TABLE actions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    pattern TEXT NOT NULL
);

CREATE DATABASE monitoring;

SELECT datname FROM pg_database;

-- View all databases
SELECT datname FROM pg_database;

-- View all tables
SELECT table_name FROM information_schema.tables WHERE table_schema='public';

-- View table structure
\d+ users
