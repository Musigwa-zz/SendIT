import Joi from 'joi';
import { Pool } from 'pg';
import dotEnv from 'dotenv';

dotEnv.config();
const databaseConfig = {
  development: process.env.DATABASE_URL_DEV,
  test: process.env.DATABASE_URL_TEST,
  production: process.env.DATABASE_URL
};
export default class Database {
  constructor(schema, tableName) {
    // const { DATABASE_URL: connectionString } = process.env;
    this.pool = new Pool({ connectionString: databaseConfig[process.env.NODE_ENV] });
    this.table = tableName;
    this.schema = schema;
  }

  end() {
    return this.pool.end();
  }

  createError(err) {
    const { detail: message, name, ...rest } = err;
    return { message, name: 'ValidationError', ...rest };
  }

  connect() {
    return this.pool.connect();
  }

  createKeyValue(args, operator = 'AND', prevIndex = 0) {
    const argsKeys = Object.keys(args);
    const lastIndex = argsKeys.length - 1;
    const values = [];
    let keys = '';
    argsKeys.map((key, index) => {
      values.push(args[key]);
      keys += `${key}=$${prevIndex + index + 1}`;
      if (index !== lastIndex) keys += ` ${operator} `;
    });
    return { keys, values, lastIndex: lastIndex + 1 };
  }

  // METHOD TO SAVE THE NEW INCOMING DATA //

  save(data) {
    return new Promise((resolve, reject) => {
      Joi.validate(data, this.schema)
        .then(res => {
          this.connect()
            .then(client => {
              const resKeys = Object.keys(res);
              const values = [];
              let keys = '';
              let nspace = '';
              resKeys.map((key, index) => {
                values.push(res[key]);
                keys += `${key}`;
                nspace += `$${index + 1}`;
                if (index !== resKeys.length - 1) {
                  keys += ',';
                  nspace += ',';
                }
              });
              client
                .query(
                  `INSERT INTO ${this.table}(${keys}) values(${nspace}) returning*`,
                  values
                )
                .then(response => resolve(response.rows[0]))
                .catch(err => reject(this.createError(err)));
            })
            .catch(err => reject(this.createError(err)));
        })
        .catch(err => {
          const { details, name } = err;
          return reject({ name, ...details[0] });
        });
    });
  }

  // METHOD TO SEARCH FOR DATA IN THE COLLECTION FOR ANY GIVEN SEARCH QUERIES //

  find(args = {}) {
    const { keys, values } = this.createKeyValue(args);
    const condition = Object.keys(args).length ? ` WHERE ${keys}` : '';
    return new Promise((resolve, reject) => {
      this.connect().then(client => {
        client
          .query(`SELECT * FROM ${this.table}${condition}`, values)
          .then(data => resolve(data.rows))
          .catch(err => reject(this.createError(err)));
      });
    });
  }

  // METHOD TO SEARCH FOR SPECIFIC DATA IN THE COLLECTION FOR A GIVEN ID //

  findById(id) {
    return new Promise((resolve, reject) => {
      this.find({ id })
        .then(res => resolve(res[0]))
        .catch(err => reject(this.createError(err)));
    });
  }

  // METHOD TO UPDATE SPECIFIC DATA IN THE COLLECTION FOR A GIVEN ID //

  findByIdAndUpdate(id, args = {}) {
    const { keys, values } = this.createKeyValue(args, ',');
    return new Promise((resolve, reject) => {
      this.findById(id)
        .then(found => {
          this.connect()
            .then(client => client.query(
              `UPDATE ${this.table} SET ${keys} WHERE id=${found.id} returning*`,
              values
            ))
            .then(res => resolve(res.rows))
            .catch(err => reject(this.createError(err)));
        })
        .catch(err => reject(this.createError(err)));
    });
  }

  // METHOD TO UPDATE RECORDS THST MATCH THE GIVEN CONDITIONS //

  update(args = {}, conditions = {}) {
    const { keys, values, lastIndex } = this.createKeyValue(args, ',');
    const { keys: condKeys, values: condValues } = this.createKeyValue(
      conditions,
      'AND',
      lastIndex
    );
    const condition = Object.keys(conditions).length ? `WHERE ${condKeys}` : '';
    return new Promise((resolve, reject) => {
      this.connect()
        .then(client => {
          client
            .query(
              `UPDATE ${this.table} SET ${keys} ${condition} returning*`,
              values.concat(condValues)
            )
            .then(res => resolve(res.rows))
            .catch(err => reject(this.createError(err)));
        })
        .catch(err => reject(this.createError(err)));
    });
  }

  // METHOD TO REMOVE SPECIFIC DATA IN THE COLLECTION FOR A GIVEN ID //

  findByIdAndRemove(id) {
    return new Promise((resolve, reject) => {
      this.findById(id)
        .then(found => {
          this.connect()
            .then(client => client.query(
              `DELETE FROM ${this.table} WHERE id=${found.id}LIMIT 1 returning*`
            ))
            .then(res => resolve(res.rows))
            .catch(err => reject(this.createError(err)));
        })
        .catch(err => reject(this.createError(err)));
    });
  }

  // DELETE ALL RECORDS FROM THE TABLE //

  remove(args = null) {
    return new Promise((resolve, reject) => {
      this.find(args)
        .then(found => {
          found.map(elmt => this.store.splice(this.store.indexOf(elmt), 1));
          if (found === this.store) this.index = 0;
          resolve(this.store.sort((a, b) => a.updatedAt < b.updatedAt));
        })
        .catch(err => reject(err));
    });
  }
}

// END OF THE COLLECTIONS CLASS //
