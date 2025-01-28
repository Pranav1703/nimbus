import mongoose  from "mongoose"

const IntegritySchema = new mongoose.Schema({
    path:{
        type: String,
        required: true
    },
    checksum:{
        type:String,
        required: true
    }
})

export const Integrity = mongoose.model("Integrity",IntegritySchema)