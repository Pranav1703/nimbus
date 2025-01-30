import mongoose from "mongoose"
import { IFileState } from "./state";

export interface IUser extends Document {
    email: string;
    rootId: string;
    fileStates: mongoose.Types.ObjectId[] | IFileState[]; 
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
    fileStates:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "FileState"
    }]
})

export const User = mongoose.model<IUser>("User",UserSchema)