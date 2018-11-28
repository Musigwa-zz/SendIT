import Parcel from '../models/Parcel';

// /***************** CREATE THE PARCEL ***************************************/

const createParcel = (req, res) => {
  Parcel.save({ ...req.body })
    .then(parcel => res.status(201).json({ error: null, parcel }))
    .catch(err => res.status(400).json({ error: err }));
};

// /**GET ALL PARCELS [filter them with search queries/getAll if no queries]****/

const getAll = (req, res) => {
  const { id: sender = null } = req.params;
  Parcel.find(sender !== null ? { sender, ...req.query } : req.query)
    .then(parcels => (parcels.length
      ? res.status(200).json({ error: null, parcels })
      : res.status(204).json({ error: { message: 'no content' } })))
    .catch(err => res.status(400).json({ error: err }));
};

// /***************** GET THE PARCEL BY ID ************************************/

const getParcel = (req, res) => {
  const { id } = req.params;
  Parcel.findById(id)
    .then(parcel => res.status(200).json({ error: null, parcel }))
    .catch(err => res.status(400).json({ error: err }));
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
          res.status(400).json({
            error: {
              message: "can't update the delivered or cancelled order",
              name: 'ValidationError'
            }
          });
        } else {
          Parcel.update({ ...req.body }, { id })
            .then(parcels => {
              const [parcel] = parcels;
              return res.status(201).json({ error: null, parcel });
            })
            .catch(err => res.status(400).json({ error: err }));
        }
      })
      .catch(err => res.status(400).json({ error: err }));
  } else {
    return res.status(400).json({
      error: { message: "can't empty the record", name: 'ValidationError' }
    });
  }
};

// /************************ END OF PARCELS APIs ******************************/

export {
  createParcel, getAll, getParcel, updateParcel
};
