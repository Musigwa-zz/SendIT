import Parcel from '../models/Parcel';
import Helpers from '../helpers';
import constants from '../helpers/constants';

const {
  OK, CREATED, FORBIDDEN, NOT_FOUND, BAD_REQUEST
} = constants.statusCode;

// /***************** CREATE THE PARCEL ***************************************/

const createParcel = (req, res) => {
  const { isadmin, id: sender } = req.user;
  Parcel.validate({ ...req.body, sender })
    .then(results => {
      if (!isadmin) {
        Parcel.save(results)
          .then(parcel => res
            .status(CREATED)
            .json({ message: 'Order created successfully', parcel }))
          .catch(err => Helpers.respondWithError(res, { status: BAD_REQUEST, ...err }));
      } else {
        return Helpers.respondWithError({
          status: FORBIDDEN,
          message: 'Only client can create orders'
        });
      }
    })
    .catch(error => Helpers.respondWithError(res, {
      ...error.details[0],
      status: BAD_REQUEST
    }));
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
  Parcel.find({ id, sender })
    .then(parcels => {
      const [parcel] = parcels;
      return res.status(OK).json({ message: 'Successful', parcel });
    })
    .catch(err => Helpers.respondWithError(res, {
      err,
      status: NOT_FOUND,
      message: `No parcel order matching to id(${id})`
    }));
};

// /*********** CANCEL THE PARCEL DELIVERY ORDER ******************************/

const updateParcel = (req, res) => {
  const { id } = req.params;
  const { isadmin, id: sender } = req.user;
  if (
    (!isadmin && (req.url.includes('cancel') || req.url.includes('destination')))
    || isadmin
  ) {
    if (Object.keys(req.body).length) {
      Parcel.find(isadmin ? { id } : { id, sender })
        .then(records => {
          const { status: st } = records[0];
          if (st.toLowerCase() === 'delivered' || st.toLowerCase() === 'cancelled') {
            return Helpers.respondWithError(res, {
              status: FORBIDDEN,
              message: "Can't update the delivered or cancelled order"
            });
          }
          return Parcel.update(req.body, { id })
            .then(parcels => {
              const [parcel] = parcels;
              return res.status(CREATED).json({ message: 'Successful', parcel });
            })
            .catch(err => Helpers.respondWithError(res, {
              ...err,
              status: NOT_FOUND,
              message: 'Something went wrong'
            }));
        })
        .catch(err => Helpers.respondWithError(res, {
          ...err,
          status: NOT_FOUND,
          message: 'No such parcel found'
        }));
    } else {
      return Helpers.respondWithError(res, {
        status: BAD_REQUEST,
        message: 'Provide the new value(s) for the field(s) to update'
      });
    }
  } else {
    return Helpers.respondWithError(res, {
      status: FORBIDDEN,
      message: "Can't perform this task unless you're admin"
    });
  }
};

// /************************ END OF  APIs ******************************/

export {
  createParcel, getAll, getParcel, updateParcel
};
