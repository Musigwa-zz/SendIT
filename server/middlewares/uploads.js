import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'
    ? cb(null, true) // (error?:Error(), save?:boolean)
    : cb(null, false); // (error?:Error(), save?:boolean)
};

export default multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter
});
