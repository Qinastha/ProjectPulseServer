import express from 'express';
import {checkAuth} from "../middlewares";
import {createNewProfile, updateProfile,uploadAvatar} from "../controllers";

const router = express.Router();

router.post('/uploadAvatar',checkAuth,uploadAvatar)
router.post('/new',checkAuth,createNewProfile)
router.put('/update',checkAuth,updateProfile)

export const profileRoutes = router;