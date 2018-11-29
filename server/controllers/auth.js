import multer from 'multer';
import bcrypt from 'bcrypt';

import User from '../models/User';
import Helpers from '../helpers';
import constants from '../config/constants';

// /***************** UPLOADING USER ASSETS ***********************************/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'
    ? cb(null, true) // (error?:Error(), save?:boolean)
    : cb(null, false); // (error?:Error(), save?:boolean)
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter
});

// /***************** CREATE THE USER ***************************************/

const createUser = (req, res) => {
  const { file = {} } = req;
  const { path: avatar } = file;

  /** encrypt the password before saving */
  // bcrypt.hash(pass, 10, (err, password) => {
  //   if (err) return res.status(500).json({ message: err.message });

  /** save the new user in the database */
  User.save({ ...req.body, avatar })
    .then(user => {
      const { email, id, role } = user;
      res.status(201).json({
        message: constants.SUCCESS,
        token: Helpers.createToken({ email, id, role }, { expiresIn: '1h' })
      });
    })
    .catch(error => {
      let { message = '' } = error;
      if (message.includes('phone')) {
        message = 'The phone should be [10 min, 14 max] digits and/or starts with + symbol';
      }
      if (message.includes('password')) {
        message = 'The password should be 7 characters minimum with at least one[uppercase,lowercase,number]';
      }
      return res.status(400).json({ message });
    });
  // });
};

// /***************** THE USER ACCOUNT LOGIN ********************************/

const login = (req, res) => {
  const { email: mail, password: pass } = req.body;
  User.find({ email: mail })
    .then(users => {
      bcrypt.compare(pass, users[0].password, (err, same) => {
        if (same === true) {
          const { email, id, role } = users[0];
          return res.status(200).json({
            message: constants.SUCCESS,
            token: Helpers.createToken({ email, id, role }, { expiresIn: '1h' })
          });
        }
        return res.status(401).json({ message: 'email or password mismatch!' });
      });
    })
    .catch(err => res.status(401).json({ message: err.message }));
};

// /************************ EXPORT ALL USERS AUTH HANDLERS ******************/

export { createUser, upload, login };
