import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.router.js';
import userRouter from './routes/user.router.js';
import passwordRouter from './routes/password.router.js';
import routineRouter from './routes/routine.router.js';
import noteRouter from './routes/note.router.js';
import { ENV } from './config/env.js';


const app = express();
const PORT = ENV.PORT || 5000;

app.use(cors({
  origin: [
    ENV.CLIENT_URL,           // live
    'http://localhost:5173',  // react js
    'http://localhost:5174',  // react js fallback 
    'http://localhost:3000',  // next js
  ],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: "Hello from server" });
});

app.use('/api/health', (req, res) => {
  res.status(200).json({
    message: `server is running`,
    success: true,
  })
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/password', passwordRouter);
app.use('/api/routines', routineRouter);
app.use('/api/notes', noteRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
