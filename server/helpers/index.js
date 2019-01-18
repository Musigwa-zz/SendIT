import jwt from 'jsonwebtoken';
import config from 'config';
import ctrlDebugger from 'debug';
import constants from './constants';

const { UNAUTHORIZED, INTERNAL_SERVER_ERROR } = constants.statusCode;
const debug = ctrlDebugger('sendit:controller');
export default class Helpers {
  static createToken(user, options = { expiresIn: '1h' }) {
    const { email, id, isadmin } = user;
    return jwt.sign({ email, id, isadmin }, config.get('JWT_KEY'), options);
  }

  static respondWithError(
    res,
    error = { status: INTERNAL_SERVER_ERROR, message: 'Something went wrong!..' }
  ) {
    let { message = 'Something went wrong!..' } = error;
    const { status = INTERNAL_SERVER_ERROR } = error;
    if (message.includes('phone')) message = 'The phone number should be(unique, 9 min, 14 max). Country code is optional.';
    else if (message.includes('password')) message = 'The password should be 7 chars min with at least one(uppercase,lowercase,number,symbol)';
    if (status === UNAUTHORIZED) message = 'Email or password mismatch!';
    debug(error);
    return res.status(status).json({ message });
  }

  static decodeToken(token) {
    return jwt.verify(token, config.get('JWT_KEY'));
  }
}
