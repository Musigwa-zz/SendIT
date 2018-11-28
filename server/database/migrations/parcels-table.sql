CREATE TABLE
IF NOT EXISTS parcels
(
    id SERIAL PRIMARY KEY,
    recipient_phone VARCHAR
(15) NOT NULL,
    recipient_name VARCHAR
(50),
    destination VARCHAR
(50) NOT NULL,
    present_location VARCHAR
(30) NOT NULL,
    origin VARCHAR
(30) NOT NULL,
    weight numeric CHECK
(weight > 0),
    sender INTEGER NOT NULL REFERENCES users
(id),
    status VARCHAR
(20) NOT NULL,
    price numeric NOT NULL CHECK
(price > 0),
    createdat timestamp NOT NULL DEFAULT now
(),
    updatedat timestamp NOT NULL DEFAULT now
()
)