import mongoose from "mongoose"


export interface IUser extends Document {
    email: string;
    rootId: string;
    rootpaths: string
}

const UserSchema = new mongoose.Schema<IUser>({
    email:{
        type: String,
        required: true,
        unique:true
    },
    rootpaths:[{
        type: String,
    }]
})

export const User = mongoose.model<IUser>("User",UserSchema)