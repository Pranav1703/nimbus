import mongoose  from "mongoose"

export interface IFileState extends Document {
    path: string;
    hash?: string;  
}

const FileStateSchema = new mongoose.Schema<IFileState>({
    path:{
        type: String,
        required: true,
        unique:true
    },
    hash:{
        type:String,
    }
})

export const FileState = mongoose.model<IFileState>("FileState",FileStateSchema)