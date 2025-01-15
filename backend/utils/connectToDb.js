import mongoose from "mongoose";
const connectToDb = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`connected to mongodb ${conn.connection.host}`);
    } catch(error){
        console.error('error in connectToDb: ', error);
    }
}

export default connectToDb;