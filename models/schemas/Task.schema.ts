import mongoose, {Document, ObjectId, Schema} from 'mongoose';
import {UserPosition, TaskStatus} from "../types";
import {ITaskChecklistItem} from "../interfaces";

interface ITask extends Document {
    taskDepartment: UserPosition,
    taskStatus:TaskStatus,
    creator: ObjectId;
    members: ObjectId[];
    title: string;
    description: string;
    checklist: ITaskChecklistItem[];
    comments: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    startedAt: Date;
    completedAt: Date;
    deadLine:Date
}

const taskSchema = new Schema<ITask>({
    taskDepartment:{type: String,required: true},
    taskStatus: {type:String,required: true},
    creator: {type: Schema.Types.ObjectId,ref: 'User',required: true},
    members: {type: [Schema.Types.ObjectId],ref: 'User',required: true},
    title: {type: String,required: true},
    description: {type: String,required: true},
    checklist: {type: Schema.Types.Mixed,required: true},
    comments: {type: [Schema.Types.ObjectId],ref: 'Comment'},
    createdAt: {type: Date,required: true,default:Date.now()},
    updatedAt: {type: Date,required: true,default: Date.now()},
    startedAt: {type: Date},
    completedAt: {type: Date},
    deadLine:{type:Date}
});

export const Task = mongoose.model<ITask>('Task', taskSchema);