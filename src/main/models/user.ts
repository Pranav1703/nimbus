import mongoose from "mongoose"
import { IBackupInfo } from "./backup";

export interface IUser extends Document {
    email: string;
    rootId: string;
    rootpaths: string[];
    backupStatus: IBackupInfo[]
}

const UserSchema = new mongoose.Schema<IUser>({
    email:{
        type: String,
        required: true,
        unique:true
    },
    rootpaths:[{
        type: String,
    }],

    backupStatus:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BackupInfo"
    }]
    
})

export const User = mongoose.model<IUser>("User",UserSchema)