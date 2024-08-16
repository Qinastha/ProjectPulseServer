import mongoose, {Document, ObjectId, Schema} from 'mongoose';

interface IProject extends Document {
    projectName: string;
    projectDescription: string;
    projectAvatar: string;
    creator: ObjectId;
    members: ObjectId[];
    taskLists: ObjectId[];
    createdAt: Date,
    updatedAt: Date,
    startedAt: Date,
    completedAt: Date,
    isCompleted: boolean
    chats: ObjectId[];
}

const projectSchema = new Schema<IProject>({
    projectName: {type:String,required: true},
    projectDescription: {type:String,required: true},
    projectAvatar: {type:String,default: 'project avatar'},
    creator: {type:Schema.Types.ObjectId, ref: 'User',required: true},
    members: {type:[Schema.Types.ObjectId], ref: 'User',required: true,default: []},
    taskLists: {type: [Schema.Types.ObjectId],ref: 'TaskList',default: []},
    createdAt: {type: Date,required: true,default: Date.now()},
    updatedAt: {type: Date,required: true,default: Date.now()},
    startedAt: {type: Date},
    completedAt: {type: Date},
    isCompleted: {type: Boolean,required: true,default: false},
    chats: {type: [Schema.Types.ObjectId], ref: 'Chat', required: true, default: []}
});

export const Project = mongoose.model<IProject>('Project', projectSchema);