import Parcel from '../models/Parcel';
import constants from '../config/constants';

// /***************** CREATE THE PARCEL ***************************************/

const createParcel = (req, res) => {
  Parcel.save({ ...req.body })
    .then(parcel => res.status(201).json({ message: constants.SUCCESS, parcel }))
    .catch(err => {
      let { message } = err;
      if (message.includes('phone')) {
        message = 'The recipient phone should be [10 min, 14 max] digits and/or starts with + symbol';
      }
      return res.status(400).json({ message });
    });
};

// /**GET ALL PARCELS [filter them with search queries/getAll if no queries]****/

const getAll = (req, res) => {
  const { id: sender = null } = req.params;
  Parcel.find(sender !== null ? { sender, ...req.query } : req.query)
    .then(parcels => (parcels.length
      ? res.status(200).json({ message: constants.SUCCESS, parcels })
      : res.status(204).json({ message: 'No parcel orders yet' })))
    .catch(err => res.status(400).json({ message: err.message }));
};

// /***************** GET THE PARCEL BY ID ************************************/

const getParcel = (req, res) => {
  const { id } = req.params;
  Parcel.findById(id)
    .then(parcel => res.status(200).json({ message: constants.SUCCESS, parcel }))
    .catch(err => res.status(400).json({ message: err.message }));
};

// /*********** CANCEL THE PARCEL DELIVERY ORDER ******************************/

const updateParcel = (req, res) => {
  const { id } = req.params;
  if (Object.keys(req.body).length) {
    Parcel.findById(id)
      .then(record => {
        if (
          record.status.toLowerCase() === 'delivered'
          || record.status.toLowerCase() === 'cancelled'
        ) {
          res
            .status(400)
            .json({ message: "Can't update the delivered or cancelled order" });
        } else {
          Parcel.update({ ...req.body }, { id })
            .then(parcels => {
              const [parcel] = parcels;
              return res.status(201).json({ message: constants.SUCCESS, parcel });
            })
            .catch(err => res.status(400).json({ message: err.message }));
        }
      })
      .catch(err => res.status(400).json({ message: err.message }));
  } else {
    return res
      .status(400)
      .json({ message: 'Provide the new value(s) for the field(s) to update' });
  }
};

// /************************ END OF PARCELS APIs ******************************/

export {
  createParcel, getAll, getParcel, updateParcel
};
