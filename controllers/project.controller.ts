import { Request, Response } from 'express';
import {Project, Task, Comment, User} from "../models";

export const getProject = async (req: Request,res: Response) => {
    const projectId = req.params.projectId;
    try {
        if(req.user.projects.includes(projectId)) {
            const project = await Project.findOne({_id: projectId});
            if(project) {
                res.status(201).json(project)
            }
        }
    }catch (e) {
        console.log(e)
    }
}

export const getAllProjects = async (req: Request,res: Response) => {
    const projects = await Project.find();
    res.status(201).json(projects)
}

export const createProject = async (req: Request,res: Response) => {
    const userId = req.user._id;
    const {projectName,projectDescription,projectAvatar,members} = req.body;
    const projectObj = {
        projectName,
        projectDescription,
        projectAvatar,
        members,
        creator: userId
    }
   try {
       const newProject = await Project.create(projectObj);
       if(newProject) {
           const updatedUsers = await User.updateMany({_id:{ $in: projectObj.members}},{$push: {projects:newProject._id}});
           if(updatedUsers) {
               res.status(201).json(newProject)
           } else {
               console.log('Users are not updated')
           }
       } else {
           console.log('Project is not created')
       }
   }catch (e) {
       console.log(e)
   }
}

export const updateProject = async (req: Request,res: Response) => {
    const projectId = req.params.projectId
    const {projectName,projectDescription,projectAvatar,members,tasks} = req.body;
    const updateObj = {
        projectName,
        projectDescription,
        projectAvatar,
        members,
        tasks,
        updatedAt: Date.now()
    }
    try {
        const updatedProject = await Project.findOneAndUpdate({_id: projectId},updateObj,{new:true}).populate(['creator','members','tasks']);
        if(updatedProject) {
            res.status(201).json(updatedProject)
        } else {
            console.log('Project is not updated')
        }
    }catch (e) {
        console.log(e)
    }
}

export const deleteProject = async (req: Request,res: Response) => {
    const projectId = req.params.projectId;
    try {
        const deletedProject = await Project.findOneAndDelete({_id:projectId});
        const deletedTasks = await Task.deleteMany({project: projectId});
        const deletedComments = await Comment.deleteMany({project: projectId})
        if(deletedProject && deletedTasks && deletedComments) {
            res.status(201).json({message: 'Project is deleted'})
        }
    }catch (e) {
        console.log(e)
    }
}