import { Request, Response } from 'express';
import {Profile, User} from "../models";

export const createNewProfile = async (req: Request,res:Response) => {
    const profileData = req.body;
    const user = req.user;
        try {
            if(!user.profile) {
                const profile = await Profile.create(profileData);
                if(profile) {
                    const newUser = await User.findOneAndUpdate({_id: user._id},{profile:profile._id},{new: true}).select('-password').populate('profile');
                    if(newUser){
                        res.success(newUser,`${newUser.firstName} ${newUser.lastName}, your profile is successfully created`,201,true)
                    } else {
                        res.error({message: 'No user found'},404)
                    }
                } else {
                    res.error({message: 'Invalid user data'},400)
                }
        } else  {
                res.error({message: 'User has already profile'},400)
    }
        } catch (e) {
            res.error({message: 'Internal Server Error'},500,true)
        }
}

export const updateProfile = async (req: Request,res:Response) => {
    const newProfileData = req.body
    const profileId = req.user.profile._id;
    try {
        if(profileId && newProfileData) {
            const updatedProfile = await Profile.findOneAndUpdate({_id:profileId},newProfileData,{new: true});
            if(updatedProfile) {
                const updatedUser = await User.findOne({_id: req.user._id}).select('-password').populate('profile');
                if(updatedUser) {
                    res.success(updatedUser,`${updatedUser.firstName} ${updatedUser.lastName}, your profile is successfully uopdated`,201,true)
                } else {
                    res.error({message: 'Invalid user data'},400)
                }
            } else {
                res.error({message: 'Invalid user data'},400)
            }
        }
    } catch (e) {
        res.error({message: 'Internal Server Error'},500,true)
    }
}