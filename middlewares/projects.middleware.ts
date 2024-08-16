import { Request, Response, NextFunction } from 'express';
import {Project} from "../models";

export const getUserProjects = async(req:Request, res:Response, next:NextFunction) => {
    const userId = req.user.id;

    try {
        const projects = await Project.find({members: {$in: [userId]}}).populate([{
            path: 'taskLists',
            model: 'TaskList',
            populate: {
                path: 'tasks',
                model: 'Task',
                populate: [{
                    path:'members',
                    model: 'User',
                    populate: {
                        path: "profile",
                        model: "Profile",
                    }
                }]
            }
        }, {
            path: 'members',
            model: 'User',
            populate: {
                path: "profile",
                model: "Profile",
            }
        }, {
            path: 'chats',
            model: 'Chat',
            populate: [{
                path: 'currentProject',
                model: 'Project'
            }, {
                path:'members',
                model: 'User',
                populate: {
                    path: "profile",
                    model: "Profile",
                }
            }, {
                path:"messages",
                model: "Message",
                populate: [{
                    path:'sender',
                    model: 'User',
                    populate: {
                        path: "profile",
                        model: "Profile",
                    }
                    }, {
                    path:'receiver',
                    model: 'User',
                    populate: {
                        path: "profile",
                        model: "Profile",
                    }
                }]
            }]
        }
        ]);
        if(projects) {
            req.projects = projects
            next();
        } else {
            res.error({message: 'Project not found'}, 404, true)
        }
    } catch (err:any) {
        res.error({message: 'Internal Server Error',details: err.message},500,true)
    }
}