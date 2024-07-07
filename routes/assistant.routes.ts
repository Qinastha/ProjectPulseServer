import express from 'express';
import { queryGPT } from '../controllers';
import { checkAuth } from '../middlewares';

const router = express.Router();

router.post('/query', checkAuth, queryGPT);

export const assistantRoutes = router;