import Joi from 'joi';
import { Pool } from 'pg';
import config from 'config';
import dbDebugger from 'debug';

const debug = dbDebugger('sendit:db');
const connectionString = config.get('DB_URL');
debug(`DB_URL: ${connectionString}`);
export default class Database {
  constructor(schema, tableName) {
    this.table = tableName;
    this.schema = schema;
  }

  // UTIL METHOD FOR CUATOMIZING THE ERROR //

  createError(err) {
    const { detail: message, ...rest } = err;
    const error = new Error(message);
    return {
      error,
      message,
      name: 'QueryError',
      ...rest
    };
  }

  // UTIL METHOD FOR VALIDATING THE DATA WITH THE SCHEMA //

  validate(data, schema = this.schema) {
    return Joi.validate(data, schema);
  }

  // UTIL METHOD FOR CREATING THE {KEY, VALUE} PAIR //

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

  // UTIL METHOD FOR CREATING THE {KEY, VALUE, NAMESPACE} PAIR //

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

  // CREATE THE CLIENT CONNECTION AND EXPOSE A QUERY //

  query(queryStream, values = []) {
    const pool = new Pool({ connectionString });
    return new Promise(async (resolve, reject) => {
      pool.connect().then(client => client
        .query(queryStream, values)
        .then(res => {
          client.release();
          return res.rows.length
            ? resolve(res.rows)
            : reject(this.createError({ detail: 'No matching items found' }));
        })
        .catch(err => {
          debug(err);
          client.release();
          return reject(this.createError(err));
        }));
      await pool.end();
    });
  }

  // PUSH THE NEW OBJECT INTO THE DATABSE'S DEFINED TABLE //

  save(data) {
    const { values, keys, nspace } = this.NamespaceKeyValue(data);
    return this.query(
      `INSERT INTO ${this.table}(${keys}) values(${nspace}) returning*`,
      values
    );
  }

  // SEARCH FOR RECORDS THAT MATCH THE GIVEN SEARCH QUERIES //

  find(args = {}) {
    const { keys, values } = this.createKeyValue(args);
    const condition = Object.keys(args).length ? ` WHERE ${keys}` : '';
    return this.query(`SELECT * FROM ${this.table}${condition}`, values);
  }

  // SEARCH FOR SPECIFIC RECORD THAT MATCHES THE GIVEN ID //

  findById(id) {
    return new Promise((resolve, reject) => {
      this.find({ id })
        .then(rows => resolve(rows[0]))
        .catch(err => reject(this.createError(err)));
    });
  }

  // UPDATE RECORD(S) THAT MATCH(ES) THE GIVEN CONDITION(S) //

  update(args = {}, conditions = {}) {
    const { keys, values, lastIndex } = this.createKeyValue(args, ',');
    const { keys: condKeys, values: condValues } = this.createKeyValue(
      conditions,
      'AND',
      lastIndex
    );
    const condition = Object.keys(conditions).length ? `WHERE ${condKeys}` : '';
    return this.query(
      `UPDATE ${this.table} SET ${keys} ${condition} returning*`,
      values.concat(condValues)
    );
  }

  // UPDATE SPECIFIC RECORD THAT MATCHES THE GIVEN ID //

  findByIdAndUpdate(id, args = {}) {
    return new Promise((resolve, reject) => {
      this.findById(id)
        .then(() => this.update(args, { id }))
        .then(rows => resolve(rows[0]))
        .catch(err => reject(err));
    });
  }

  // DELETE RECORD(S) THAT MATCH(ES) THE GIVEN CONDITION(S) //

  remove(args = {}, conditions = {}) {
    const { keys, values, lastIndex } = this.createKeyValue(args, ',');
    const { keys: condKeys, values: condValues } = this.createKeyValue(
      conditions,
      'AND',
      lastIndex
    );
    const condition = Object.keys(conditions).length ? `WHERE ${condKeys}` : '';
    return this.query(
      `DELETE ${keys} FROM ${this.table} ${condition} returning*`,
      values.concat(condValues)
    );
  }

  // REMOVE SPECIFIC RECORD THAT MATCHES THE GIVEN ID //

  findByIdAndRemove(id) {
    return new Promise((resolve, reject) => {
      this.findById(id)
        .then(() => this.remove({ id }))
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  // DELETE ALL RECORDS FROM THE TABLE //

  removeAll() {
    return this.query(`TRUNCATE ${this.table} RESTART IDENTITY CASCADE returning*`);
  }
}
