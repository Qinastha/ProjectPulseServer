import express from 'express';
import {
    createProject, deleteProject,
    getAllProjects,
    getProject,
    updateProject
} from "../controllers";
import {checkAuth} from "../middlewares";

const router = express.Router();

router.get('/all',checkAuth,getAllProjects)
router.get('/:projectId',checkAuth,getProject)
router.post('/new',checkAuth,createProject)
router.put('/update/:projectId',checkAuth,updateProject)
router.delete('/delete/:projectId',checkAuth,deleteProject)

export const projectRoutes = router;