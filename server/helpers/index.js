import jwt from 'jsonwebtoken';
import config from 'config';
import ctrlDebugger from 'debug';

const debug = ctrlDebugger('sendit:controller');

export default class Helpers {
  static createToken(user, options = { expiresIn: '1h' }) {
    const { email, id, role } = user;
    return jwt.sign({ email, id, role }, config.get('JWT_KEY'), options);
  }

  static respondWithError(
    res,
    error = { status: 500, message: 'Something went wrong!..' }
  ) {
    if (error.message.includes('phone')) error.message = 'The phone should be (unique, 10 min, 14 max) digits and/or starts with (+) symbol.';
    if (error.message.includes('password')) error.message = 'The password should be 7 characters minimum with at least one[uppercase,lowercase,number]';
    if (error.status === 401) error.message = 'email or password mismatch!';
    debug(error);
    return res.status(error.status).json({ message: error.message });
  }
}
