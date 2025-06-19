import express from 'express';
import multer from 'multer';
import path from 'path';
import { registerUser, getUser, loginUser } from '../controllers/users.js';

//creating a new router for user related endpoints
const router = express.Router();

//multer for file uploads - pic
const storage = multer.diskStorage({ destination: (req, file, cb) => cb(null, 'uploads/'), filename: (req, file, cb) =>
  cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`) });
const upload = multer({ storage });

//creating a new router for user related endpoints
router.use('/uploads', express.static(path.resolve('uploads')));
router.post('/', upload.single('image'), registerUser);
router.get('/:id', getUser);
router.post('/tokens', loginUser);

export default router;
