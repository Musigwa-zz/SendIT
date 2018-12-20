import { Router } from 'express';
import { getAll as getParcels } from '../controllers/parcels';
import getUserInfo from '../controllers/users';

const users = Router();
const entry = '/users';

// /*********************** GET USER INFO ************************************/

users.get(`${entry}/me`, getUserInfo);

// /*********************** GET USER PARCELS *********************************/

users.get(`${entry}/:id/parcels`, getParcels);

// /************************ END OF USERS APIs ******************************/

export default users;
