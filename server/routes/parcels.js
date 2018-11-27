import { Router } from 'express';

import {
  createParcel,
  getAll,
  getParcel,
  updateParcel
} from '../controllers/parcels';

const parcels = Router();
const entry = '/parcels';

// /***************** CREATE THE PARCEL ****************************************/

parcels.post(`${entry}`, createParcel);

// /***************** GET ALL PARCELS ******************************************/

parcels.get(`${entry}`, getAll);

// /***************** GET THE PARCEL BY ID ************************************/

parcels.get(`${entry}/:id`, getParcel);

// /*********** CANCEL THE PARCEL DELIVERY ORDER ********************************/

parcels.put(
  `${entry}/:id/cancel`,
  (req, res, next) => {
    req.body.status = 'cancelled';
    next();
  },
  updateParcel
);

// /*********** CHANGE THE ORDER'S STATUS *************************************/

parcels.put(`${entry}/:id/status`, updateParcel);

// /************************ END OF PARCELS APIs ******************************/

export default parcels;
