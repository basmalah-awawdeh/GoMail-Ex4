import express from 'express';
import { getMails, sendMail, getMailById, updateMail, deleteMail, searchMails } from '../controllers/mails.js';
import { authMiddleware } from '../middleware/auth.js';

//creating a new router for mails and authnitication
const router = express.Router();
router.use(authMiddleware);
//mails functions
router.get('/', getMails);
router.post('/', sendMail);
router.get('/search/:query', searchMails);
router.get('/:id', getMailById);
router.patch('/:id', updateMail);
router.delete('/:id', deleteMail);

export default router;
