import { Router } from 'express';

import { createUser, login } from '../controllers/auth';
import uploads from '../middlewares/uploads';

const auth = Router();
const entry = '/auth';

// /***************** CREATE THE USER ACCOUNT **********************************/

auth.post(`${entry}/signup`, uploads.single('avatar'), createUser);

// /***************** USER ACCOUNT LOGIN **************************************/

auth.post(`${entry}/login`, login);

// /************************ END OF PARCELS APIs ******************************/

export default auth;
