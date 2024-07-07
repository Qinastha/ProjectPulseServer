import express from 'express';
import { registerUser, authUser } from '../controllers';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);

export const authRoutes = router;