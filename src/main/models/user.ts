import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    rootId:{
        type: String,
        required: true
    },
    fileStates:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Integrity"
    }]
})

export const User = mongoose.model("User",UserSchema)