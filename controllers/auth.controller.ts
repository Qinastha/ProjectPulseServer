import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {ObjectId} from "mongoose";
import {User} from "../models";

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
};

export const registerUser = async (req: Request, res: Response) => {
    const { email, password,firstName,lastName,userName,dateOfBirth, role,position } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.error({ message: 'User already exists' },400,true)
        }

        const user = await User.create({ email, password,firstName,lastName,userName,dateOfBirth,role,position });

        if (user) {
            const userID: ObjectId = user._id as ObjectId
            res.success(generateToken(userID.toString()), `${user.firstName} ${user.lastName}, your account is created`,201,true)
        } else {
            return res.error({ message: 'Invalid user data' },400,true)
        }
    }catch (e: any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
};

export const authUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const userID: ObjectId = user._id as ObjectId
            res.success(generateToken(userID.toString()),`Welcome back, ${user.firstName} ${user.lastName}`,201,true)
        } else {
            return res.error({ message: 'Invalid username or password' },401,true);
        }
    }catch (e:any) {
        res.error({message: 'Internal Server Error',details: e.message},500,true)
    }
};