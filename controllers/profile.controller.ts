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
                res.status(201).json(newUser)
            } else {
                res.status(404).json({
                    message: 'No user found'
                })
            }
        } else {
            res.status(404).json({
                message: 'Profile is not created'
            })
        }
    } else  {
        res.status(404).json({
            message: 'User has already profile'
        })
    }
} catch (e) {
    console.log(e)
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
                    res.status(201).json(updatedUser)
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
}