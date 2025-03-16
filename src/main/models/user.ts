import mongoose from "mongoose"
import { IFileState } from "./state";

export interface IUser extends Document {
    email: string;
    rootId: string;
    paths: string
}

const UserSchema = new mongoose.Schema<IUser>({
    email:{
        type: String,
        required: true,
        unique:true
    },
    rootId:{
        type: String,
        required: true
    },
    paths:{
        type: String,
    }
})

export const User = mongoose.model<IUser>("User",UserSchema)