import express from 'express';
import { getLabels, createLabel, getLabelById, updateLabel, deleteLabel } from '../controllers/labels.js';
import { authMiddleware } from '../middleware/auth.js';

//creating a new router for lables
const router = express.Router();
router.use(authMiddleware);
//labels functions
router.get('/', getLabels);
router.post('/', createLabel);
router.get('/:id', getLabelById);
router.patch('/:id', updateLabel);
router.delete('/:id', deleteLabel);

export default router;
