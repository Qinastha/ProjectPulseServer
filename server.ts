import express, { Application} from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {assistantRoutes, authRoutes, profileRoutes, projectRoutes, userRoutes} from "./routes";

dotenv.config();

const app: Application = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!).then(() => console.log('DB is connected'));

app.use('/api/auth', authRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/user',userRoutes)
app.use('/api/profile',profileRoutes)
app.use('/api/project',projectRoutes)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));