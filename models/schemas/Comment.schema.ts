import mongoose, {Document, ObjectId, Schema} from 'mongoose';

interface IComment extends Document {
    creator: ObjectId;
    text: string;
    replies: ObjectId[];
    project: ObjectId;
    task: ObjectId;
}

const commentSchema = new Schema<IComment>({
    creator: {type: Schema.Types.ObjectId,ref:'User',required: true},
    text: {type: String,required: true},
    project: {type: Schema.Types.ObjectId,ref: 'Project',required: true},
    task: {type: Schema.Types.ObjectId,ref: 'Task',required: true},
    replies: {type: [Schema.Types.ObjectId],ref: 'Comment'}
});

export const Comment = mongoose.model<IComment>('Comment', commentSchema);