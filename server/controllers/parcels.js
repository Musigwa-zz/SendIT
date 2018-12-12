import Parcel from '../models/Parcel';
import Helpers from '../helpers';
import constants from '../helpers/constants';

const {
  OK, CREATED, FORBIDDEN, NOT_FOUND, BAD_REQUEST
} = constants.statusCode;

// /***************** CREATE THE PARCEL ***************************************/

const createParcel = (req, res) => {
  const { role, id: sender } = req.user;
  if (role === 'client') {
    Parcel.save({ ...req.body, sender })
      .then(parcel => res.status(CREATED).json({ message: 'Order created successfully', parcel }))
      .catch(err => Helpers.respondWithError(res, { status: 400, ...err }));
  } else {
    return Helpers.respondWithError({
      status: FORBIDDEN,
      message: 'Only client can create orders'
    });
  }
};

// /**GET ALL PARCELS [filter them with search queries/getAll if no queries]****/

const getAll = (req, res) => {
  const { id: sender = null } = req.params;
  Parcel.find(sender !== null ? { sender, ...req.query } : req.query)
    .then(parcels => res.status(OK).json({ message: 'Successful', parcels }))
    .catch(err => Helpers.respondWithError(res, {
      ...err,
      status: NOT_FOUND,
      message: 'No parcel orders created yet'
    }));
};

// /***************** GET THE PARCEL BY ID ************************************/

const getParcel = (req, res) => {
  const { id } = req.params;
  const { id: sender } = req.user;
  Parcel.findById({ id, sender })
    .then(parcel => res.status(OK).json({ message: 'Successful', parcel }))
    .catch(err => Helpers.respondWithError(res, {
      err,
      status: NOT_FOUND,
      message: `No parcel order matching to id(${id})`
    }));
};

// /*********** CANCEL THE PARCEL DELIVERY ORDER ******************************/

const updateParcel = (req, res) => {
  const { id } = req.params;
  const { role } = req.user;
  const { status } = req.body;
  if ((role === 'client' && status === 'cancelled') || role === 'admin') {
    if (Object.keys(req.body).length) {
      Parcel.findById(id)
        .then(record => {
          const { status: st } = record;
          if (st.toLowerCase() === 'delivered' || st.toLowerCase() === 'cancelled') {
            return Helpers.respondWithError(res, {
              status: FORBIDDEN,
              message: "Can't update the delivered or cancelled order"
            });
          }
          return Parcel.update(req.body, { id });
        })
        .then(parcel => res.status(CREATED).json({ message: 'Successful', parcel }))
        .catch(err => Helpers.respondWithError(res, { ...err, status: BAD_REQUEST }));
    } else {
      return Helpers.respondWithError(res, {
        status: BAD_REQUEST,
        message: 'Provide the new value(s) for the field(s) to update'
      });
    }
  } else {
    return Helpers.respondWithError(res, {
      status: BAD_REQUEST,
      message: "Can't perform this task unless you're admin"
    });
  }
};

// /************************ END OF  APIs ******************************/

export {
  createParcel, getAll, getParcel, updateParcel
};
