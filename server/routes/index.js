import express, { Router } from 'express';
import parcelsRoutes from './parcels';
import usersRoutes from './users';
import auth from './auth';
import Helpers from '../helpers';

const all = Router();

/** ********* API ENTRYPOINT **************************** */

const entryPoint = Router();
entryPoint.get('/', (req, res) => {
  res.status(200).json({ error: null, message: 'welcome' });
});

/** ********* UPLOADS ENDPOINT ************************** */

const uploads = ('/uploads', express.static('uploads'));

/** ********** ALL ENDPOINTS *************************** */

// Unprotected routes
all.use(entryPoint, auth);
// Protected routes
all.use(Helpers.checkAuth, parcelsRoutes, usersRoutes, uploads);

export default all;
