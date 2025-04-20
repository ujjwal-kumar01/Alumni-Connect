// routes/globalChat.routes.js
import express from 'express';
import { getAllGlobalMessages, postGlobalMessage } from '../controllers/globalChat.controller.js';

const router = express.Router();

router.get('/', getAllGlobalMessages);
router.post('/', postGlobalMessage);

export default router;
