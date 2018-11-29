import Joi from 'joi';
import Database from '../database';

// the schema definition of the parcel

const schema = Joi.object().keys({
  recipient_name: Joi.string()
    .trim()
    .optional(),
  recipient_phone: Joi.string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .required()
    .min(10)
    .required(),
  present_location: Joi.string()
    .trim()
    .required()
    .min(1),
  destination: Joi.string()
    .trim()
    .required(),
  origin: Joi.string()
    .trim()
    .required()
    .min(1),
  weight: Joi.number()
    .required()
    .min(1),
  sender: Joi.number()
    .min(1)
    .required(),
  status: Joi.string()
    .trim()
    .only('transit', 'delivered', 'cancelled')
    .default('unconfirmed'),
  price: Joi.number()
    .required()
    .min(1)
});

export default new Database(schema, 'parcels');
