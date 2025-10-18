import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully")
    } catch (error) {
        console.log("Error! MongoDB connection Failed", error);
    }
}
export default connectDB;