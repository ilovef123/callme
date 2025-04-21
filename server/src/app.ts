import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/callme', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.use('/api/auth', authRoutes);

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});