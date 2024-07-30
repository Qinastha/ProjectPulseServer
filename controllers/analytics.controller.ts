import {Request, Response} from "express";
import {Project, User} from "../models";

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export const numberOfProjects = async (req: Request,res: Response) => {
    try {
        const projects = await Project.find();
        if(projects?.length > 0) {
            let result:any = {};
            projects.forEach(project => {
                const createdMonth = monthNames[project.createdAt?.getMonth()];
                if(createdMonth) {
                    if(Object.keys(result).includes(createdMonth)) {
                        result[createdMonth] += 1
                    } else {
                        result[createdMonth] = 1;
                    }
                } else {
                    res.error({message: 'Invalid data format for createdAt prop'},400)
                }
            })
            res.success(result,'Numbers of all projects are retrieved',201,false)
        }
    }catch (e:any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}

export const numberOfUsers = async (req: Request,res: Response) => {
    try {
        const users = await User.find();
        if(users?.length > 0) {
            let result:any = {};
            users.forEach(user => {
                const createdMonth = monthNames[user.createdAt?.getMonth()];
                console.log(createdMonth)
                if(createdMonth) {
                    if(Object.keys(result).includes(createdMonth)) {
                        result[createdMonth] += 1
                    } else {
                        result[createdMonth] = 1;
                    }
                } else {
                    res.error({message: 'Invalid data format for createdAt prop'},400)
                }
            })
            res.success(result,'Numbers of all projects are retrieved',201,false)
        }
    }catch (e:any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}

export const getProjectMembersPerformance = async (req: Request,res: Response) => {
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
        if(project?.members) {
            let result = [];
            const allCompletedTasks = project?.taskLists.
            map((list: any) => list.tasks).
            reduce((prev,cur) => prev.concat(cur),[]).
            filter((task:any) => task.completedAt)

            console.log(allCompletedTasks)
            // project.members.forEach((member:any,index) => {
            //     const data = {};
            //     allCompletedTasks.reduce((prev:any,cur:any) => {
            //         if(cur.members.includes(member._id)) {
            //             return prev += 1
            //         } else return prev
            //     },1)
            // })

        }else {
            res.error({message: 'Project is not existed'},400)
        }
    }catch (e: any){
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}