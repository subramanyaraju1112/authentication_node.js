import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined");
        }
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB successfully")
    } catch (error) {
        console.error("Failed to connect MongoDB:", error);
        throw error
    }
}

export default connectDB;