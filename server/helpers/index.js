import jwt from 'jsonwebtoken';
import config from 'config';

export default class Helpers {
  static createToken(user, options = {}) {
    const { email, id, role } = user;
    return jwt.sign({ email, id, role }, config.get('JWT_KEY'), {
      ...options,
      expiresIn: '1h'
    });
  }

  static async checkAuth(req, res, next) {
    const { authorization } = req.headers;
    try {
      const [bearer, token] = authorization.split(' ');
      bearer === 'Bearer'
        ? await (req.user = jwt.verify(token, config.get('JWT_KEY')))
        : null;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Provide the correct authentication information' });
    }
  }
}
