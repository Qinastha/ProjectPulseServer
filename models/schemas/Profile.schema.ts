import mongoose, {Document, Schema} from 'mongoose';
import {UserAddress} from "../interfaces";

interface IProfile extends Document {
    avatar: string;
    phoneNumber: string,
    gender: string,
    address: UserAddress,
    language: string,
    timeZone: string,

}

const profileSchema = new Schema<IProfile>({
    avatar: {type: String},
    phoneNumber: {type: String,unique: true,required: true},
    gender: {type: String,required: true},
    address: {any: Object},
    language: {type: String},
    timeZone: {type: String,required: true}
});

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);