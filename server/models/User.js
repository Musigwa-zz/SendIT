import Joi from 'joi';
import Database from '../database';

// the schema definition of the user

const schema =  {
  full_name: Joi.string()
    .trim()
    .required()
    .min(3),
  phone: Joi.string()
    .trim()
    .regex(/^\+?[1-9]\d{9,14}$/)
    .required()
    .min(10),
  isAdmin: Joi.boolean()
    .only(false)
    .default(false),
  email: Joi.string()
    .trim()
    .email({ minDomainAtoms: 2 })
    .required(),
  password: Joi.string()
    .trim() // (uppercase, lowercase, number, symbol) = 1+, (long) = 7+
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,})/)
    .required(),
  avatar: Joi.string()
    .trim()
    .uri()
};

// exporting the model of users

export default new Database(schema, 'users');
