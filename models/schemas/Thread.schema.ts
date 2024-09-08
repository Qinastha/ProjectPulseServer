import mongoose, {Schema, Document, ObjectId} from 'mongoose';

interface Thread extends Document {
    title: string;
    messages: ObjectId[];
}

const ThreadSchema: Schema = new mongoose.Schema({
    title: { type: String, required: true, default: 'New Thread' },
    messages: { type: [Schema.Types.ObjectId], ref: 'ThreadMessage', default:[], required: true},
});

export const Thread = mongoose.model<Thread>('Thread', ThreadSchema);