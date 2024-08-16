import mongoose, {ObjectId, Schema} from "mongoose";

interface ChatProps {
    messages: ObjectId[];
    members: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    avatar: string;
    name: string;
    description: string;
    currentProject: ObjectId;
}

const chatSchema = new Schema<ChatProps> ({
    messages: { type: [Schema.Types.ObjectId], ref: 'Message', required: true, default: [] },
    members: { type: [Schema.Types.ObjectId], ref: 'User', required:true, default: []},
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now },
    avatar: { type: String, default: 'user avatar' },
    name: { type: String, required: true, },
    description: { type: String },
    currentProject: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
})

export const Chat = mongoose.model<ChatProps>('Chat', chatSchema);