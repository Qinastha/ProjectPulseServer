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
            req.user = await User.findById(decoded.id).select('-password').populate('profile');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};