import _ from 'lodash';
import User from '../models/User';
import Helpers from '../helpers';
import constants from '../helpers/constants';

const { OK, NOT_FOUND } = constants.statusCode;

// /***************** THE USER ACCOUNT INFO ********************************/

const getUserInfo = (req, res) => {
  const { id } = req.user;
  User.findById(id)
    .then(user => {
      const omitKeys = ['password'];
      if (Date.parse(user.updatedat) === Date.parse(user.createdat)) omitKeys.push('updatedat');
      return res
        .status(OK)
        .json({ message: 'Successful', me: _.omit(user, omitKeys) });
    })
    .catch(err => Helpers.respondWithError(res, {
      ...err,
      status: NOT_FOUND,
      message: 'current user info not found, consider logging in'
    }));
};

// /************************ EXPORT ALL USERS AUTH HANDLERS ******************/

export default getUserInfo;
