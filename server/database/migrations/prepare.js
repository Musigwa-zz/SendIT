import Database from '..';

const functions = [
  `CREATE OR REPLACE FUNCTION update_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
  NEW.updatedat = now();
  RETURN NEW;
  END;
  $$ language 'plpgsql';`
];

const triggers = [
  `CREATE TRIGGER user_timestamp BEFORE UPDATE
  ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp();`,
  `CREATE TRIGGER parcels_timestamp BEFORE UPDATE
  ON parcels FOR EACH ROW EXECUTE PROCEDURE update_timestamp();`
];
const tables = [
  `CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    names VARCHAR(30) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(200),
    avatar VARCHAR(80) DEFAULT NULL,
    createdat timestamp NOT NULL DEFAULT now(),
    updatedat timestamp NOT NULL DEFAULT now(),
    UNIQUE(email,phone)
)`,
  `CREATE TABLE IF NOT EXISTS parcels(
    id SERIAL PRIMARY KEY,
    recipient_phone VARCHAR(15) NOT NULL,
    recipient_name VARCHAR(50),
    destination VARCHAR(50) NOT NULL,
    present_location VARCHAR(30) NOT NULL,
    origin VARCHAR(30) NOT NULL,
    weight numeric CHECK(weight > 0),
    sender INTEGER NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL,
    price numeric NOT NULL CHECK(price > 0),
    createdat timestamp NOT NULL DEFAULT now(),
    updatedat timestamp NOT NULL DEFAULT now()
)`
];

const db = new Database(null, null);
(() => {
  db.connect()
    .then(client => {
      // create the database functions
      functions.forEach(async funcQuery => {
        await client
          .query(funcQuery)
          .then(res => console.log(
            `Function "${funcQuery.slice(
              funcQuery.indexOf('ON') + 3,
              funcQuery.indexOf('(')
            )}" ${res.command}D`
          ))
          .catch(err => console.log(err));
      });

      // create the database triggers
      triggers.forEach(async trigQuery => {
        await client
          .query(
            `DROP TRIGGER IF EXISTS ${trigQuery.slice(
              15,
              trigQuery.indexOf('BEFORE') - 1
            )} ${trigQuery.slice(
              trigQuery.indexOf('ON'),
              trigQuery.indexOf('FOR EACH') - 1
            )}`
          )
          .then(async () => {
            await client
              .query(trigQuery)
              .then(res => console.log(
                `Trigger "${trigQuery.slice(
                  trigQuery.indexOf('GER') + 3,
                  trigQuery.indexOf('BEFORE') - 1
                )}" ${res.command}D`
              ))
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      });

      // create all of the required tables
      tables.forEach(async tableQuery => {
        await client
          .query(tableQuery)
          .then(res => console.log(
            `Table "${tableQuery.slice(
              tableQuery.indexOf('TS') + 3,
              tableQuery.indexOf('(')
            )}" ${res.command}D`
          ))
          .catch(err => console.log(err));
      });

      // end the database connection
      db.end();
    })
    .catch(err => console.log(err));
})();

(() => {
  db.connect().then(client => {
    client
      .query('SELECT * FROM users;')
      .then(res => console.log(res.rows))
      .catch(er => console.log(er.error));
  });
})();
