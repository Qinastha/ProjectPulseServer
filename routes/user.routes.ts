import express from 'express';
import {deleteUser, getAllUsers, getUser, updateUser} from "../controllers";
import {checkAuth} from "../middlewares";

const router = express.Router();

router.get('/',checkAuth,getUser)
router.get('/all',checkAuth,getAllUsers)
router.put('/update',checkAuth,updateUser)
router.delete('/delete',checkAuth,deleteUser)

export const userRoutes = router;