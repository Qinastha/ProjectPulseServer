import express from 'express';

import {checkAuth} from "../middlewares";
import {createTask, deleteTask, updateTask} from "../controllers/task.controller";

const router = express.Router({ mergeParams: true });

router.post('/new',checkAuth,createTask)
router.put('/:taskId',checkAuth,updateTask)
router.delete('/:taskId',checkAuth,deleteTask)

export const taskRoutes = router;