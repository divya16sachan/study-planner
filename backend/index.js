import express from "express";
import connectToDb from "./utils/connectToDb.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";

import userRoutes from "./routers/user.router.js";

config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res)=>{
    res.status.json({message: "hello from the server."});
})

//ROUTES
app.use('/api/user', userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`running on http://localhost:${PORT}`);
    connectToDb();
})
