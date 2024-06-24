import { Request, Response } from 'express';
import {Profile, Project, User} from "../models";

export const getUser = async (req: Request,res: Response) => {
    res.status(201).json(req.user)
}

export const getAllUsers = async (req: Request,res: Response) => {
    try {
        const users = User.find();
        if(users) {
            res.status(201).json(users)
        }
    }catch (e) {
        console.log(e)
    }

}

export const updateUser = async (req: Request, res: Response) => {
    const newUserData = {
        ...req.body,
        updatedAt: Date.now()
    };
    const userId = req.user._id
    try {
        const newUser = await User.findOneAndUpdate({_id:userId},newUserData,{new: true}).select('-password')
        if(newUser) return res.json(newUser)
        console.log('User is not updated')
    } catch (e){
        console.log(e)
    }
};

export const deleteUser = async (req:Request,res: Response) => {
    const userId = req.user._id;
    try {
       const deletedUser = await User.findOneAndDelete({_id: userId});
       const deletedProfile = await Profile.findOneAndDelete({_id: req.user.profile._id});
       const deletedProjects = await Project.updateMany({members:{$in:{$eq: userId}}},{members: {$pull: {$eq: userId}}})
       if(deletedUser && deletedProfile && deletedProjects) {
           res.json({message:'User is deleted'})
       }

    }catch (e){
        console.log(e)
    }
}