import mongoose  from "mongoose"

const FileStateSchema = new mongoose.Schema({
    path:{
        type: String,
        required: true
    },
    checksum:{
        type:String,
    }
})

export const FileState = mongoose.model("FileState",FileStateSchema)