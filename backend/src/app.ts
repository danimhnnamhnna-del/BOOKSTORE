import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore';

mongoose.connect(mongodbUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

import bookRoutes from './routes/bookRoutes';
import transactionRoutes from './routes/transactionRoutes';
import notificationRoutes from './routes/notificationRoutes';

app.use('/api/books', bookRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send('Bookstore API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
