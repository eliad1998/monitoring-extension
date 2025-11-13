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



CREATE TABLE monitoring_rules (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    pattern VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    description VARCHAR
);

CREATE TABLE user_monitoring_rules (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    monitoring_rule_id INTEGER NOT NULL REFERENCES monitoring_rules(id) ON DELETE CASCADE,
    CONSTRAINT uix_user_monitoring_rule UNIQUE (user_id, monitoring_rule_id)
);

INSERT INTO monitoring_rules (name, pattern, type, description)
VALUES (
    'facebook_requests',
    '*://*.facebook.com/*',
    'REQUEST',
    'Monitor any HTTP requests to facebook.com'
);

INSERT INTO monitoring_rules (name, pattern, type, description)
VALUES (
    'zap_requests',
    '*://*.zap.com/*',
    'REQUEST',
    'Monitor any HTTP requests to zap.com'
);

SELECT * FROM monitoring_rules;
SELECT * FROM user_monitoring_rules;

INSERT INTO user_monitoring_rules (user_id, monitoring_rule_id)
VALUES (
    (SELECT id FROM users WHERE username = 'a'),
    (SELECT id FROM monitoring_rules WHERE name = 'facebook_requests')
);



INSERT INTO user_monitoring_rules (user_id, monitoring_rule_id)
VALUES (
    (SELECT id FROM users WHERE username = 'a'),
    (SELECT id FROM monitoring_rules WHERE name = 'zap_requests')
);

