import mongoose, {Document, Schema} from 'mongoose';

interface IProfile extends Document {
    avatar: string;
    language: string;
}

const profileSchema = new Schema<IProfile>({
    avatar: {type: String},
    language: {type:String,required: true, default: 'eng'},
});

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);