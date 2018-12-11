import bcrypt from 'bcrypt';
import authDebugger from 'debug';
import config from 'config';
import User from '../models/User';
import Helpers from '../helpers';

// /***************** CREATE THE USER ***************************************/

const debug = authDebugger('sendit:authctrl');

const createUser = (req, res) => {
  const { file = {}, baseUrl, hostname } = req;
  const { filename } = file;
  const { password, ...rest } = req.body;
  let avatar;
  if (filename) avatar = `${hostname}:${config.get('PORT')}${baseUrl}/${filename}`;

  User.validate({ ...rest, avatar, password })
    .then(results => {
      bcrypt.hash(results.password, 10, (err, hashed) => {
        const { password: pass, ...others } = results;
        if (err) {
          debug(err);
          return res.status(500).json({ message: 'Double check your password' });
        }
        User.save({ ...others, password: hashed })
          .then(user => {
            const token = Helpers.createToken(user);
            res
              .header('x-auth-token', token)
              .status(201)
              .json({ message: 'User created successfully', token });
          })
          .catch(error => {
            let { message = '' } = error;
            if (message.includes('phone')) message = 'The phone should be (unique, 10 min, 14 max) digits and/or starts with (+) symbol.';
            if (message.includes('password')) message = 'The password should be 7 characters minimum with at least one[uppercase,lowercase,number]';

            debug(error);
            return res.status(400).json({ message });
          });
      });
    })
    .catch(error => {
      debug(error.details);
      return res.status(400).json({ message: error.details[0].message });
    });
};

// /***************** THE USER ACCOUNT LOGIN ********************************/

const login = (req, res) => {
  const { email: mail, password: pass } = req.body;
  User.find({ email: mail })
    .then(users => {
      bcrypt.compare(pass, users[0].password, (err, same) => {
        if (same === true) {
          return res.status(200).json({
            message: 'success',
            token: Helpers.createToken(users[0])
          });
        }
        return res.status(401).json({ message: 'email or password mismatch!' });
      });
    })
    .catch(err => res.status(401).json({ message: err.message }));
};

// /************************ EXPORT ALL USERS AUTH HANDLERS ******************/

export { createUser, login };
