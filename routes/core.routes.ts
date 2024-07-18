import express from 'express';
import {checkAuth} from "../middlewares";
import {uploadImage} from "../controllers";
const router = express.Router();

router.post('/uploadImage',checkAuth, uploadImage);

export const coreRoutes = router;