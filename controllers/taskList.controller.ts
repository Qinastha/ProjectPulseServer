import { Request, Response } from 'express';
import {Project, TaskList} from "../models";

export const createTaskList = async (req: Request,res: Response) => {
    const projectId = req.params.projectId;
    const {taskListName,taskLists} = req.body
    console.log(req.params)
    try {
        const projectTaskList = await TaskList.create({taskListName});
        if(projectTaskList) {
            const newTaskLists = [...taskLists,projectTaskList._id]
            const updatedProject = await Project.findOneAndUpdate({_id:projectId},{taskLists:newTaskLists},{new: true}).populate([{
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
            if(updatedProject) {
                res.success(updatedProject,`Task list "${taskListName}" is successfully created`,201,true)
            } else {
                res.error({message: 'Project is not updated'},400)
            }
        } else {
            res.error({message: 'Invalid user data'},400)
        }
    }catch (e:any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}

export const updateTaskList = async (req: Request,res: Response) => {
    const projectId = req.params.projectId;
    const taskListId = req.params.taskListId;
    const {taskListName} = req.body;
    try {
        const updatedTaskList = await TaskList.findOneAndUpdate({_id: taskListId},{taskListName,updatedAt: Date.now()});
        if(updatedTaskList) {
            const project = await Project.findOne({_id:projectId}).populate([{
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
                res.success(project,`Task list "${taskListName}" is successfully updated`,201,true)
            } else {
                res.error({message: 'Task list is not updated'},400)
            }
        }else {
            res.error({message: 'Invalid user data'},400)
        }
    } catch (e:any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}

export const deleteTaskList = async (req: Request,res: Response) => {
    const taskListId = req.params.taskListId;
    try {
        const deletedTaskList = await TaskList.findOneAndDelete({_id: taskListId});
        if(deletedTaskList) {
            res.success(null,`Task list "${deletedTaskList.taskListName}" is successfully deleted`,201,true)
        } else {
            res.error({message: 'Task list is not deleted'},400)
        }
    }catch (e: any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}