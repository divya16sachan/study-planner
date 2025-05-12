import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: "Hello from server" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // connectDB();
});
