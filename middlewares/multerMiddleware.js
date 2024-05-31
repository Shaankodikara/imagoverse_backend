import multer from "multer";

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, 'tempImage.png');
    },
  });

  export const upload = multer({ storage: storage }).single('image');

