import Joi from 'joi';
import Database from '../database';

// the schema definition of the user

const schema = Joi.object().keys({
  names: Joi.string()
    .trim()
    .required()
    .min(3),
  phone: Joi.string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .required()
    .min(10),
  email: Joi.string()
    .trim()
    .email({ minDomainAtoms: 2 })
    .required(),
  password: Joi.string()
    .trim() // Eight characters min, at least one[uppercase,lowercase,number]
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{7,}$/)
    .required(),
  avatar: Joi.string()
    .trim()
    .uri()
});

// exporting the model of users

export default new Database(schema, 'users');
