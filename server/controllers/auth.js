import multer from 'multer';
import bcrypt from 'bcrypt';

import User from '../models/User';
import Helpers from '../helpers';

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
  const {
    names, phone, email, password: pass
  } = req.body;

  /** encrypt the password before saving */
  bcrypt.hash(pass, 10, (err, password) => {
    if (err) return res.status(500).json({ error: err });

    /** save the new user in the database */
    User.save({
      names,
      phone,
      email,
      password,
      avatar
    })
      .then(user => res.status(201).json({
        error: null,
        token: Helpers.createToken(
          { email: user.email, id: user.id },
          { expiresIn: '1h' }
        ),
        id: user.id
      }))
      .catch(error => res.status(400).json({ error }));
  });
};

// /***************** THE USER ACCOUNT LOGIN ********************************/

const login = (req, res) => {
  const { email, password: pass } = req.body;
  User.find({ email })
    .then(users => {
      bcrypt.compare(pass, users[0].password, (err, same) => {
        if (same === true) {
          return res.status(200).json({
            error: null,
            token: Helpers.createToken(
              { email: users[0].email, id: users[0].id },
              { expiresIn: '1h' }
            ),
            id: users[0].id
          });
        }
        return res.status(401).json({
          error: {
            name: 'ValidationError',
            message: 'email or password mismatch!'
          }
        });
      });
    })
    .catch(err => res.status(401).json({ error: err }));
};

// /************************ EXPORT ALL USERS AUTH HANDLERS ******************/

export { createUser, upload, login };
