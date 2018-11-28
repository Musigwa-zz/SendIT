import Joi from 'joi';
import Database from '../database';

// the schema definition of the parcel

const schema = Joi.object().keys({
  recipient_name: Joi.string().optional(),
  recipient_phone: Joi.string()
    .min(10)
    .required(),
  present_location: Joi.string()
    .required()
    .min(1),
  destination: Joi.string().required(),
  origin: Joi.string()
    .required()
    .min(1),
  weight: Joi.number()
    .required()
    .min(1),
  sender: Joi.number()
    .min(1)
    .required(),
  status: Joi.string()
    .only('transit', 'delivered', 'cancelled')
    .default('unconfirmed'),
  price: Joi.number()
    .required()
    .min(1)
});

export default new Database(schema, 'parcels');
