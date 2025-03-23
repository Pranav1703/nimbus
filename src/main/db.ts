import mongoose from "mongoose";
import "dotenv/config"

const MONGO_URI = process.env.MONGOURI as string;

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("DB Connected ");
    } catch (error) {
        console.error("error ", error);
    }
};

export const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log("DB Connection closed.");
    } catch (error) {
        console.error("Error closing DB connection:", error);
    }
};
