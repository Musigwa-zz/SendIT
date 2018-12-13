import jwt from 'jsonwebtoken';
import config from 'config';

export default async (req, res, next) => {
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
};
