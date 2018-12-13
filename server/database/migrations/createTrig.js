const triggers = [
  `CREATE TRIGGER user_timestamp BEFORE UPDATE
    ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp();`,
  `CREATE TRIGGER parcels_timestamp BEFORE UPDATE
    ON parcels FOR EACH ROW EXECUTE PROCEDURE update_timestamp();`
];

const createTrig = (db, debug, index = 0) => {
  if (index === triggers.length) return;
  db.query(
    `DROP TRIGGER IF EXISTS ${triggers[index].slice(
      15,
      triggers[index].indexOf('BEFORE') - 1
    )} ${triggers[index].slice(
      triggers[index].indexOf('ON'),
      triggers[index].indexOf('FOR EACH') - 1
    )}`
  )
    .then(() => db.query(triggers[index]))
    .then(() => {
      debug(
        `Trigger "${triggers[index].slice(
          triggers[index].indexOf('GER') + 3,
          triggers[index].indexOf('BEFORE') - 1
        )}" CREATED`
      );
      setTimeout(() => createTrig(db, debug, index + 1), 1000);
    })
    .catch(err => debug(err));
};

export default createTrig;
