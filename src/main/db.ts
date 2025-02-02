import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/nimbus";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("DB Connected ");
    } catch (error) {
        console.error("error ", error);
    }
};
