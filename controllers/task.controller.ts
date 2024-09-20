import { Request, Response } from 'express';
import {Project, Task, TaskList} from "../models";
import {ObjectId} from "mongodb";

export const createTask = async (req: Request,res: Response) => {
    const taskListId = req.params.taskListId;
    const projectId = req.params.projectId
    const {taskDepartment,title, description, members, checkList, deadLine,taskStatus } = req.body;
    const taskObj = {
        title,
        description,
        members,
        checkList,
        deadLine,
        creator: req.user._id,
        taskDepartment,
        taskStatus
    }
    try {
        const newTask = await Task.create(taskObj)
        if(newTask) {
            const taskId = newTask._id as ObjectId
            const updatedTaskList = await TaskList.findOneAndUpdate({_id: taskListId},{$push: {tasks: taskId}},{new: true})
            if(updatedTaskList) {
                const taskLists = await Project.findOne({_id: projectId}).populate([{
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
                if(taskLists) {
                    res.success(taskLists,`Task "${title}" is successfully added`,201,true)
                }else {
                    res.error({message: 'Project is not existed'}, 400)
                }
            } else {
                res.error({message: 'Task list is not updated'},400)
            }

        } else {
            res.error({message: 'Invalid user data'},400)
        }
    }catch (e:any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}

export const updateTask = async (req: Request,res: Response) => {
    const taskId = req.params.taskId;
    const projectId = req.params.projectId;
    let updatedObj = req.body
    if(updatedObj.checkList.every((listItem:any) => listItem.isCompleted)) {
        updatedObj = {
            ...updatedObj,
            completedAt: new Date()
        }
    }
    try {
        const updatedTask = await Task.findOneAndUpdate({_id: taskId},updatedObj,{new: true});
        if(updatedTask) {
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
                res.success(project,`Task "${updatedTask.title}" is successfully updated`,201,true)
            } else {
                res.error({message: 'Project is not existed'},400)
            }
        }else {
            res.error({message: 'Invalid user data'},400)
        }
    }catch (e:any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}

export const deleteTask = async (req: Request,res: Response) => {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    try {
        const deletedTask = await Task.findOneAndDelete({_id: taskId});
        const updatedProject = await Project.findOneAndUpdate({_id: projectId},{tasks: {$pull: {$eq: taskId}}})

        if(deletedTask && updatedProject) {
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
            if(project){
                res.success(project,`Task "${deletedTask.title}" is successfully deleted`,201,true)
            }else {
                res.error({message: 'Project is not existed'},400)
            }
        }else {
            res.error({message: 'Invalid user data'},400)
        }
    }catch (e: any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}