import express from "express";
import {createChat, deleteChat, updateChat} from "../controllers";
import {checkAuth, getUserProjects} from "../middlewares";

const router= express.Router();

router.post("/", checkAuth,getUserProjects, createChat)
router.put("/:chatId", checkAuth,getUserProjects, updateChat)
router.delete("/:chatId", checkAuth, getUserProjects, deleteChat)

export const chatRoutes = router;