CREATE TABLE
IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    full_name VARCHAR
(30) NOT NULL,
    phone VARCHAR
(15) NOT NULL,
    email VARCHAR
(50) NOT NULL,
    password VARCHAR
(200) NOT NULL,
    role VARCHAR
(10) NOT NULL,
    avatar VARCHAR
(80) DEFAULT NULL,
    createdat timestamp NOT NULL DEFAULT now
(),
    updatedat timestamp NOT NULL DEFAULT now
(),
    UNIQUE
(email,phone)
)