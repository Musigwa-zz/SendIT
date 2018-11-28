CREATE TABLE
IF NOT EXISTS users
(id SERIAL PRIMARY KEY, names VARCHAR
(30) NOT NULL,
    phone VARCHAR
(15) NOT NULL UNIQUE,
    email VARCHAR
(50) NOT NULL UNIQUE,
    password VARCHAR
(200),
    avatar VARCHAR
(80) DEFAULT NULL,
    createdat timestamp NOT NULL DEFAULT now
(),
    updatedat timestamp NOT NULL DEFAULT now
())