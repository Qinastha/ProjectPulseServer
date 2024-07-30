import express from 'express';
import {checkAuth} from "../middlewares";
import {getProjectMembersPerformance, numberOfProjects, numberOfUsers} from "../controllers";

const router = express.Router();

router.get('/numberOfProjects',checkAuth,numberOfProjects)
router.get('/numberOfUsers',checkAuth,numberOfUsers)
router.get('/projectMembersPerformance/:projectId',checkAuth,getProjectMembersPerformance)

export const analyticsRoutes = router;