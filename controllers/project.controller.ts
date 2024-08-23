import { Request, Response } from 'express';
import { Project, Task, Comment } from "../models";

export const getProject = async (req: Request,res: Response) => {
    const projectId = req.params.projectId;
    try {
        const project = await Project.findOne({_id: projectId}).populate([{
            path: 'taskLists',
            model: 'TaskList',
            populate: {
                path: 'tasks',
                model: 'Task',
                populate: [{
                    path:'members',
                    model: 'User'
                },{
                    path:'creator',
                    model: 'User'
                }]
            }
        },{
            path:'members',
            model: 'User'
        },{
            path:'creator',
            model: 'User'
        }]);

        if(project) {
            res.success(project,`Project ${project.projectName} is successfully retrieved`,200)
        } else {
            res.error({message: 'No project found'},400,true)
        }
    }catch (e:any) {
        res.error({message: 'Internal Server Error', details: e.message},500,true)
    }
}

export const getAllProjects = async (req: Request,res: Response) => {
    try {
        const projects = await Project.find().populate(['members','creator']);

        if(projects){
            res.success(projects,'All projects are successfully retrieved',200,true)
        } else {
            res.error({message: 'No projects found'},400,true)
        }
    }catch (e:any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}

export const getUserProjects = async(req:Request, res:Response) => {
    const memberId = req.user._id;
    try {
        const projects = await Project.find({members: memberId}).populate([
            {
                path: 'members',
                model: 'User',
            },
            {
                path: 'creator',
                model: 'User',
            },
            {
                path: 'chats',
                model: 'Chat',
                populate: [
                    {
                        path: 'messages',
                        model: 'Message',
                        populate: {
                                path: 'sender',
                                model: 'User',
                                populate: {
                                    path: 'profile',
                                    model: 'Profile',
                                },
                            },
                    }, {
                        path: 'members',
                        model: 'User',
                        populate: {
                            path: 'profile',
                            model: 'Profile',
                        },
                    },
                ],
            },
        ]);

        if(projects){
            res.success(projects,'Projects of the logged in user are successfully retrieved',200,true)
        } else {
            res.error({message: 'No projects found'},404,true)
        }
    }catch (e:any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}

export const createProject = async (req: Request,res: Response) => {
    const userId = req.user._id;
    const { projectName,projectDescription,projectAvatar,members } = req.body;
    const projectObj = {
        projectName,
        projectDescription,
        projectAvatar,
        members:[...members,userId],
        creator: userId
    }
   try {
       const newProject = await Project.create(projectObj);
       if(newProject) {
           res.success(newProject,`Project ${newProject.projectName} is successfully created`,201,true)
       } else {
           res.error({message: 'Invalid user data'},400,true)
       }
   }catch (e:any) {
       res.error({message: 'Internal Server Error',details: e.message},500,true)
   }
}

export const updateProject = async (req: Request,res: Response) => {
    const projectId = req.params.projectId
    const { projectName,projectDescription,projectAvatar,members,taskLists } = req.body;
    const updateObj = {
        projectName,
        projectDescription,
        projectAvatar,
        members,
        taskLists,
        updatedAt: Date.now()
    }
    try {
        const updatedProject = await Project.findOneAndUpdate({_id: projectId},updateObj,{new:true}).populate(['creator','members','taskLists']);
        if(updatedProject) {
            res.success(updatedProject,`Project ${updatedProject.projectName} is successfully updated`,201,true)
        } else {
            res.error({message: 'Invalid user data'},400,true)
        }
    }catch (e:any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}

export const deleteProject = async (req: Request,res: Response) => {
    const projectId = req.params.projectId;
    try {
        const deletedProject = await Project.findOneAndDelete({_id:projectId});
        const deletedTasks = await Task.deleteMany({project: projectId});
        const deletedComments = await Comment.deleteMany({project: projectId})
        if(deletedProject && deletedTasks && deletedComments) {
            res.success(null, `Project ${deletedProject.projectName} is deleted`,204)
        } else {
            res.error({message: 'Invalid user data'},400,true)
        }
    }catch (e:any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}