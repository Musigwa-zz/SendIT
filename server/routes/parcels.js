import { Router } from 'express';

import { createParcel, getAll } from '../controllers/parcels';

const parcels = Router();
const entry = '/parcels';

// /***************** CREATE THE PARCEL ***************************************/

parcels.post(`${entry}`, createParcel);

// /***************** GET ALL PARCELS ******************************************/

parcels.get(`${entry}`, getAll);

// /************************ END OF PARCELS APIs ******************************/

export default parcels;
