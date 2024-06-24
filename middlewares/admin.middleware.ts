import { Request, Response, NextFunction } from 'express';

export const checkAdminRole = async (req: Request, res: Response, next: NextFunction) => {
    if(req.user.role === 'admin') next()
    else res.status(401).json({message: 'You do not have permission'})
}