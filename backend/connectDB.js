import mongoose from "mongoose";
import ora from "ora";

const connectDB = async () => {
    const spinner = ora("Connecting to MongoDB...").start();
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        spinner.succeed(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        spinner.fail("Error connecting to MongoDB");
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;