const functions = [
  `CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
    NEW.updatedat = now();
    RETURN NEW;
    END;
    $$ language 'plpgsql';`
];

// creating the function
const createFunc = (db, debug, index = 0) => {
  if (index === functions.length) return;
  db.query(functions[index])
    .then(() => {
      debug(
        `Function "${functions[index].slice(
          functions[index].indexOf('ON') + 3,
          functions[index].indexOf('(')
        )}" CREATED`
      );
      setTimeout(() => createFunc(db, debug, index + 1), 1000);
    })
    .catch(err => debug(err));
};

export default createFunc;
