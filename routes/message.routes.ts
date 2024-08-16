import express from "express";
import {checkAuth, getUserProjects} from "../middlewares";
import {createMessage, deleteMessage, getMessages, updateMessage} from "../controllers";

const router = express.Router({ mergeParams: true });

router.get('/', checkAuth, getUserProjects, getMessages)
router.post('/', checkAuth, getUserProjects, createMessage)
router.put('/:messageId', checkAuth, getUserProjects, updateMessage)
router.delete('/:messageId', checkAuth, getUserProjects, deleteMessage)

export const messageRoutes = router;