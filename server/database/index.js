import Joi from 'joi';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

import database from '../config/db';

export default class Database {
  constructor(schema, tableName) {
    const { databaseUrl: connectionString } = database;
    this.pool = new Pool({ connectionString });
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

  NamespaceKeyValue(args = {}) {
    const resKeys = Object.keys(args);
    const values = [];
    let keys = '';
    let nspace = '';
    resKeys.map((key, index) => {
      values.push(args[key]);
      keys += `${key}`;
      nspace += `$${index + 1}`;
      if (index !== resKeys.length - 1) {
        keys += ',';
        nspace += ',';
      }
    });
    return { keys, nspace, values };
  }

  // METHOD TO SAVE THE NEW INCOMING DATA //

  save(data) {
    return new Promise((resolve, reject) => {
      Joi.validate(data, this.schema)
        .then(res => {
          const { password: pass } = res;
          if (res.hasOwnProperty('password')) {
            bcrypt.hash(pass, 10, (err, password) => {
              if (err) {
                reject({ message: 'password failed' });
              }
              res.password = password;
            });
          }
          this.connect()
            .then(client => {
              const { values, keys, nspace } = this.NamespaceKeyValue(res);
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
        .then(res => (res.length
          ? resolve(res[0])
          : reject({ message: 'No matching item found', name: 'QueryError' })))
        .catch(err => reject(this.createError(err)));
    });
  }

  // METHOD TO UPDATE SPECIFIC DATA IN THE COLLECTION FOR A GIVEN ID //

  findByIdAndUpdate(id, args = {}) {
    return new Promise((resolve, reject) => {
      this.findById(id)
        .then(() => {
          this.update(args, { id })
            .then(response => resolve(response))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
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
        .then(() => {
          this.remove({ id })
            .then(removed => resolve(removed))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  // DELETE ALL RECORDS FROM THE TABLE //

  remove(conditions = {}) {
    const { keys: condKeys, values: condValues } = this.createKeyValue(conditions);
    const condition = Object.keys(conditions).length ? `WHERE ${condKeys}` : '';
    return new Promise((resolve, reject) => {
      this.connect()
        .then(client => {
          client
            .query(`DELETE FROM ${this.table} ${condition} returning*`, condValues)
            .then(res => resolve(res.rows))
            .catch(err => reject(this.createError(err)));
        })
        .catch(err => reject(this.createError(err)));
    });
  }
}

// END OF THE COLLECTIONS CLASS //
