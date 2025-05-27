import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './connectDB.js';

import authRoutes from './routes/auth.route.js';
import userRouter from './routes/user.router.js';
import passwordRouter from './routes/password.router.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: "Hello from server" });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/password', passwordRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
