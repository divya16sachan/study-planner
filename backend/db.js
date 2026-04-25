import mongoose from "mongoose";
import ora from "ora";
import { ENV } from "./config/env.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    const spinner = ora("Connecting to MongoDB...").start();
    try {
        const conn = await mongoose.connect(ENV.MONGODB_URI);
        spinner.succeed(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        spinner.fail("Error connecting to MongoDB");
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;