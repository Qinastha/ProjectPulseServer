import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {User} from "../models";

interface JwtPayload {
    id: string;
}

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
            req.user = await User.findById(decoded.id).select('-password').populate([
                { path: 'profile', select: '-__v' },
                { path: 'threads', populate: { path:'messages', select: '-__v' } },
            ]);
            next();
        } catch (error) {
            res.error({message:'Not authorized, token failed'},401);
        }
    }

    if (!token) {
        res.error({message:'Not authorized, token failed'},401);
    }
};