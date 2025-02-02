import mongoose from "mongoose";
import ora from 'ora';

const connectToDb = async()=>{
    const spinner = ora('Connecting to MongoDB...').start();

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        spinner.succeed(`Connected to MongoDB ${conn.connection.host}`);
    } catch (error) {
        spinner.fail('Failed to connect to MongoDB');
        console.error('Error in connectToDb: ', error);
    }
}

export default connectToDb;