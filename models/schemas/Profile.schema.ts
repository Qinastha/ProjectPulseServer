import mongoose, {Document, Schema} from 'mongoose';
import {UserAddress} from "../interfaces";

interface IProfile extends Document {
    avatar: string;
    phoneNumber: string,
    gender: string,
    address: UserAddress,
    language: string,
    timeZone: string,
    widgets: string[]
}

const profileSchema = new Schema<IProfile>({
    avatar: {type: String},
    phoneNumber: {type: String,unique: true,required: true},
    gender: {type: String,required: true},
    address: {type: Schema.Types.Mixed},
    language: {type: String},
    timeZone: {type: String,required: true},
    widgets: { type: [String],required: true,default: ['numberOfProjects','numberOfUsers','projectMembersPerformance']}
});

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);