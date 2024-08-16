import mongoose, {Document, ObjectId} from 'mongoose';

interface IMessage extends Document {
    sender: ObjectId;
    receiver: ObjectId;
    content: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>({
    sender: {type: String, required: true, ref: 'User'},
    receiver: {type: String, required: true, ref: 'User'},
    content: {type: String, required: true},
    date: {type: Date, required: true, default: Date.now()},
    createdAt: {type: Date, required: true, default: Date.now()},
    updatedAt: {type: Date, required: true, default: Date.now()}
})

export const Message = mongoose.model<IMessage>('Message', messageSchema);
