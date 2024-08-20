import express, {Application, NextFunction,Request,Response} from 'express';
import http from 'http';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'
import {
    assistantRoutes,
    authRoutes,
    profileRoutes,
    projectRoutes,
    userRoutes,
    coreRoutes,
    taskListRoutes,
    taskRoutes,
    analyticsRoutes, chatRoutes
} from "./routes";
import { v2 as cloudinary } from 'cloudinary';
import {messageRoutes} from "./routes/message.routes";

dotenv.config();

const app: Application = express();
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(express.json({limit: '50mb'}));

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

cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_API_CLOUD_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_API_SECRET
});

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
    origin: allowedOrigins
};

// Then pass these options to cors:
app.use(cors(options));

app.use('/api/auth', authRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/user',userRoutes)
app.use('/api/profile',profileRoutes)
app.use('/api/project',projectRoutes)
app.use('/api/project/:projectId/taskList',taskListRoutes)
app.use('/api/project/:projectId/taskList/:taskListId/task',taskRoutes)
app.use('/api/core',coreRoutes)
app.use('/api/analytics',analyticsRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/chat/:chatId/messages', messageRoutes)

//socket
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('sendMessage', (message) => {
        io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));