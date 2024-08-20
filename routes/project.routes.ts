import express from 'express';
import {
    createProject, deleteProject,
    getAllProjects,
    getProject, getUserProjects,
    updateProject
} from "../controllers";
import {checkAuth} from "../middlewares";

const router = express.Router();

router.get('/all',checkAuth,getAllProjects)
router.get('/currentProjects', checkAuth, getUserProjects)
router.get('/:projectId',checkAuth,getProject)
router.post('/new',checkAuth,createProject)
router.put('/update/:projectId',checkAuth,updateProject)
router.delete('/delete/:projectId',checkAuth,deleteProject)

export const projectRoutes = router;