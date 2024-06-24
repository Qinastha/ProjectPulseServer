import mongoose, {Document, ObjectId, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';
import {UserRole} from "../types";

interface IUser extends Document {
    email: string;
    password: string;
    role: UserRole;
    profile: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    lastActiveAt: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String,required: true},
    profile: {type: Schema.Types.ObjectId, ref: 'Profile',unique: true},
    createdAt: {type: Date,required: true,default: Date.now()},
    updatedAt: {type: Date,required: true,default: Date.now()},
    lastActiveAt: {type: Date,required: true,default: Date.now()}
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);