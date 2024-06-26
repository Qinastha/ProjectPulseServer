import express, {Application, NextFunction,Request,Response} from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {assistantRoutes, authRoutes, profileRoutes, projectRoutes, userRoutes} from "./routes";

dotenv.config();

const app: Application = express();

app.use(express.json());

// Custom Response Middleware
app.use((req: Request, res:Response, next: NextFunction) => {
    res.success = (value,message,statusCode,showUser = false) => {
        res.status(statusCode).json({
            status: statusCode,
            alert: {
                alertType: 'success',
                message,
                showUser
            },
            value
        });
    };
    next();
});

// Custom Error Middleware
app.use((req: Request, res:Response, next: NextFunction) => {
    res.error = (error,statusCode,showUser = false) => {
        console.log(error)
        res.status(statusCode).json({
            status: statusCode,
            alert: {
                alertType: 'error',
                message: error.message,
                showUser
            },
            details: error.details
        });
    };
    next();
});


mongoose.connect(process.env.MONGO_URI!).then(() => console.log('DB is connected'));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/user',userRoutes)
app.use('/api/profile',profileRoutes)
app.use('/api/project',projectRoutes)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));