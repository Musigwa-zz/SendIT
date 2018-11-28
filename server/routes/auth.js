import { Router } from 'express';

import { createUser, login } from '../controllers/auth';

const auth = Router();
const entry = '/auth';

// /***************** CREATE THE USER ACCOUNT **********************************/

auth.post(`${entry}/signup`, createUser);

// /***************** USER ACCOUNT LOGIN **************************************/

auth.post(`${entry}/login`, login);

// /************************ END OF PARCELS APIs ******************************/

export default auth;
