import mongoose, {Document, Schema} from 'mongoose';
import {ProfilePosition} from "../types";

interface IProfile extends Document {
    firstName: string;
    lastName: string;
    avatar: string;
    language: string;
    position: ProfilePosition
}

const profileSchema = new Schema<IProfile>({
    firstName: {type: String,required: true},
    lastName: {type: String, required: true},
    avatar: {type: String},
    language: {type:String,required: true, default: 'eng'},
    position:{type: String,required: true}
});

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);