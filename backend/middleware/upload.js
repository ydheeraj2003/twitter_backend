import multer from 'multer';

// Multer storage configuration for video files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Videos will be stored locally in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

const videoUpload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // Limit video size to 100MB
}).single('video'); // The name of the input field for video

export default videoUpload;
