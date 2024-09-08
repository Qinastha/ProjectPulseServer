import mongoose, {Schema, Document, ObjectId} from 'mongoose';

interface ThreadMessage extends Document {
    text: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
}

const ThreadMessageSchema: Schema = new mongoose.Schema({
    text: { type: String, required: true, default: "" },
    sender: { type: String, enum: ['user', 'assistant'], required: true },
    timestamp: { type: Date, default: Date.now },
});

export const ThreadMessage = mongoose.model<ThreadMessage>('ThreadMessage', ThreadMessageSchema);