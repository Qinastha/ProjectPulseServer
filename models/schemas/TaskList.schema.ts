import mongoose, {Document, ObjectId, Schema} from 'mongoose';

interface ITaskList extends Document {
   taskListName: string;
   tasks: ObjectId[];
   createdAt: Date;
   updatedAt: Date;
}

const taskListSchema = new Schema<ITaskList>({
    taskListName: {type:String,required: true},
    tasks: {type: [Schema.Types.ObjectId],ref: 'Task',default: []},
    createdAt: {type: Date,required: true,default: Date.now()},
    updatedAt:{type: Date,required: true,default: Date.now()}
});

export const TaskList = mongoose.model<ITaskList>('TaskList', taskListSchema);