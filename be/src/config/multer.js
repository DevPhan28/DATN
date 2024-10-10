// src/middlewares/upload.js
import multer, { diskStorage } from 'multer';

// Cấu hình multer để lưu tệp vào thư mục tạm
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Thư mục lưu tệp
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Đặt tên tệp duy nhất
  }
});

// Tạo middleware upload
const upload = multer({ storage });

export default upload;
