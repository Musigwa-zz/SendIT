import bcrypt from 'bcrypt';
import config from 'config';
import User from '../models/User';
import Helpers from '../helpers';
import constants from '../helpers/constants';

const {
  OK, CREATED, UNAUTHORIZED, BAD_REQUEST
} = constants.statusCode;

// /***************** CREATE THE USER ***************************************/

const createUser = (req, res) => {
  const { file = {}, baseUrl, hostname } = req;
  const { filename } = file;
  const { password, ...rest } = req.body;
  let avatar;
  if (filename) {
    avatar = `${hostname}`;
    avatar += process.env.NODE_ENV === 'development' ? `:${config.get('PORT')}` : '';
    avatar += `${baseUrl}/${filename}`;
  }
  User.validate({ ...rest, avatar, password })
    .then(results => {
      bcrypt.hash(results.password, 10, (err, hashed) => {
        const { password: pass, ...others } = results;
        if (err) return Helpers.respondWithError(res);
        User.save({ ...others, password: hashed })
          .then(user => res.status(CREATED).json({
            token: Helpers.createToken(user),
            admin: user.isadmin,
            message: 'User created successfully'
          }))
          .catch(error => Helpers.respondWithError(res, { ...error, status: BAD_REQUEST }));
      });
    })
    .catch(error => Helpers.respondWithError(res, { ...error.details[0], status: BAD_REQUEST }));
};

// /***************** THE USER ACCOUNT LOGIN ********************************/

const login = (req, res) => {
  const { email, password = '' } = req.body;
  User.find({ email })
    .then(users => bcrypt.compare(password, users[0].password, (err, same) => (same
      ? res.status(OK).json({
        token: Helpers.createToken(users[0]),
        admin: users[0].isadmin,
        message: 'Login successful'
      })
      : Helpers.respondWithError(res, {
        ...err,
        status: UNAUTHORIZED,
        message: 'Error login'
      }))))
    .catch(err => Helpers.respondWithError(res, { ...err, status: UNAUTHORIZED }));
};

// /************************ EXPORT ALL USERS AUTH HANDLERS ******************/

export { createUser, login };
