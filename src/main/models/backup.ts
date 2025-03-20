import mongoose from "mongoose"

export interface IBackupInfo extends Document{
    size: string
    time: number
}

const backupInfoSchema = new mongoose.Schema<IBackupInfo>({
    size:{
        type: String,
        required: true,
        unique:true
    },
    time:{
        type: Number,
    }    
})

export const BackupInfo = mongoose.model<IBackupInfo>("BackupInfo",backupInfoSchema)