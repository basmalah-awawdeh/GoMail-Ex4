import express from 'express';
import { addBlacklistedLink, deleteBlacklistedLink } from '../controllers/blacklist.js';
import { authMiddleware } from '../middleware/auth.js';

//creating a new router for blacklist
const router = express.Router();
router.use(authMiddleware);
//blacklist functions
router.post('/', addBlacklistedLink);
router.delete('/:id', deleteBlacklistedLink);

export default router;
