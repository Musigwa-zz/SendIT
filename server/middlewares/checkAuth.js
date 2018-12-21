import Helpers from '../helpers';
import constants from '../helpers/constants';

const { INTERNAL_SERVER_ERROR, UNAUTHORIZED } = constants.statusCode;
export default (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') {
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Access denied' });
    }
    req.user = Helpers.decodeToken(token);
    next();
  } catch (error) {
    return res.status(UNAUTHORIZED).json({ message: 'Access denied' });
  }
};
