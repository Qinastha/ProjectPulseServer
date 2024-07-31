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
            let data:any = {};
            projects.forEach(project => {
                const createdMonth = monthNames[project.createdAt?.getMonth()];
                if(createdMonth) {
                    if(Object.keys(data).includes(createdMonth)) {
                        data[createdMonth] += 1
                    } else {
                        data[createdMonth] = 1;
                    }
                } else {
                    res.error({message: 'Invalid data format for createdAt prop'},400)
                }
            })
            const result = {
                name: "All projects",
                description: "Analytics of projects",
                data,
            }
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
            let data:any = {};
            users.forEach(user => {
                const createdMonth = monthNames[user.createdAt?.getMonth()];
                console.log(createdMonth)
                if(createdMonth) {
                    if(Object.keys(data).includes(createdMonth)) {
                        data[createdMonth] += 1
                    } else {
                        data[createdMonth] = 1;
                    }
                } else {
                    res.error({message: 'Invalid data format for createdAt prop'},400)
                }
            })
            const result = {
                name: "All users",
                description: "Analytics of users",
                data,
            }
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
            let result:any = {
                name: "Members Performance",
                description: "Members Performance",
                data: []
            };
            const allCompletedTasks = project?.taskLists.
            map((list: any) => list.tasks).
            reduce((prev,cur) => prev.concat(cur),[]).
            filter((task:any) => task.completedAt)

            project.members.forEach((member:any,index) => {
                const memberData:any = {};
                const createdMonth = monthNames[member.createdAt?.getMonth()];
                allCompletedTasks.forEach((task: any)=> {
                    if(task.members.find((foundMember: any) => foundMember._id.equals(member._id))){
                        console.log('exist')
                        if(Object.keys(memberData).includes(createdMonth)) {
                            memberData[createdMonth] += 1
                        } else {
                            memberData[createdMonth] = 1
                        }
                    }
                })
                result.data.push({name:member.userName,data: memberData})
            })
            res.success(result,'Get members performance',201,false)

        }else {
            res.error({message: 'Project is not existed'},400)
        }
    }catch (e: any){
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
}