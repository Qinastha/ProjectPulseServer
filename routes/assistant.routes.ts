import express from 'express';
import { checkAuth } from '../middlewares';
import {createThread, createThreadMessage, deleteThread, getThreads, updateThread} from "../controllers";

const router = express.Router();

router.post('/', checkAuth, createThread);
router.get('/all', checkAuth, getThreads);
router.put('/update/:threadId', checkAuth, updateThread);
router.delete('/delete/:threadId', checkAuth, deleteThread);
router.post(`/:threadId/new`, checkAuth, createThreadMessage );

export const assistantRoutes = router;