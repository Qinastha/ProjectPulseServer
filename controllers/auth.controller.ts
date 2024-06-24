import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {ObjectId} from "mongoose";
import {User} from "../models";

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
};

export const registerUser = async (req: Request, res: Response) => {
    const { email, password,role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password,role });

    if (user) {
        const userID: ObjectId = user._id as ObjectId
        res.status(201).json({
            _id: userID,
            email: user.email,
            role: user.role,
            token: generateToken(userID.toString()),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

export const authUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const userID: ObjectId = user._id as ObjectId
        res.json({
            _id: userID,
            email: user.email,
            token: generateToken(userID.toString()),
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
};