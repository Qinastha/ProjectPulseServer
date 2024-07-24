import { Request, Response } from 'express';
import {Project, Task, TaskList} from "../models";

export const createTask = async (req: Request,res: Response) => {
    const taskListId = req.params.taskListId;
    const projectId = req.params.projectId
    const {taskDepartment,taskStatus, title, description, members, checkList, deadLine,tasks } = req.body;
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
            const updatedTaskList = await TaskList.findOneAndUpdate({_id: taskListId},{tasks: [...tasks,newTask._id]},{new: true})
            if(updatedTaskList) {
                const taskLists = await Project.findOne({_id: projectId}).populate('taskLists.tasks')
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
    const { title,
        description,
        deadLine,
        taskDepartment
    } = req.body
    const updatedObj = {
        title,
        description,
        deadLine,
        taskDepartment
    }
    try {
        const updatedTask = await Task.findOneAndUpdate({_id: taskId},updatedObj,{new: true}).populate(['members','creator','comments']);
        if(updatedTask) {
            res.status(201).json(updatedTask)
        }
    }catch (e) {
        console.log(e)
    }
}

// export const updateTaskStatus = async (req: Request,res: Response) => {
//     const taskId = req.params.taskId;
//     const {taskStatus} = req.body;
//     const updated
// }

export const deleteTask = async (req: Request,res: Response) => {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    const deletedTask = await Task.findOneAndDelete({_id: taskId});
    const updatedProject = await Project.findOneAndUpdate({_id: projectId},{tasks: {$pull: {$eq: taskId}}})

    if(deletedTask && updatedProject) {
        res.status(201).json({message: 'Task is deleted'})
    }
}