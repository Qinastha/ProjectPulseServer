import { Request, Response } from 'express';
import {Profile, Project, User} from "../models";

export const getUser = async (req: Request,res: Response) => {
    res.success(req.user,`User ${req.user.firstName} ${req.user.lastName} is retrieved`,200)
}

export const getAllUsers = async (req: Request,res: Response) => {
    try {
        const users = User.find();
        if(users) {
            res.success(users,'All users are successfully retrieved',201,true)
        } else {
            res.error({message: 'Invalid user data'},400,true)
        }
    }catch (e) {
        res.error({message: 'Internal Server Error'},500,true)
    }

}

export const updateUser = async (req: Request, res: Response) => {
    const {email,firstName,lastName} = req.body;
    const newUserData = {
        email,
        firstName,
        lastName,
        updatedAt: Date.now()
    };
    const userId = req.user._id
    try {
        const updatedUser = await User.findOneAndUpdate({_id:userId},newUserData,{new: true}).select('-password')
        if(updatedUser) {
            return res.success(updatedUser,`${updatedUser.firstName} ${updatedUser.lastName}, your account is successfully updated`,201,true)
        } else {
            res.error({message: 'Invalid user data'},400,true)
        }
    } catch (e){
        res.error({message: 'Internal Server Error'},500,true)
    }
};

export const deleteUser = async (req:Request,res: Response) => {
    const userId = req.user._id;
    try {
       const deletedUser = await User.findOneAndDelete({_id: userId});
       const deletedProfile = await Profile.findOneAndDelete({_id: req.user.profile._id});
       const deletedProjects = await Project.updateMany({members:{$in:{$eq: userId}}},{members: {$pull: {$eq: userId}}})
       if(deletedUser && deletedProfile && deletedProjects) {
           res.success(null,'User is deleted',204)
       } else {
           res.error({message: 'Invalid user data'},400,true)
       }
    }catch (e){
        res.error({message: 'Internal Server Error'},500,true)
    }
}