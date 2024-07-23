import express from 'express';

import {checkAuth} from "../middlewares";
import {createTaskList, deleteTaskList, updateTaskList} from "../controllers/taskList.controller";

const router = express.Router({ mergeParams: true });

router.post('/new',checkAuth,createTaskList)
router.put('/:taskListId',checkAuth,updateTaskList)
router.delete('/:taskListId',checkAuth,deleteTaskList)

export const taskListRoutes = router;