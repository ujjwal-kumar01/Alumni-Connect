import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();

// CORS setup
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static files (like resumes)
app.use('/public', express.static(path.join(path.resolve(), 'public')));

// Cookie parser
app.use(cookieParser());

// Importing Routes
import userRoutes from './routes/user.routes.js';
import contactRoutes from './routes/contact.routes.js';
import messageRoutes from './routes/message.routes.js';
import jobRoutes from './routes/job.routes.js';
import applicationRoutes from './routes/application.routes.js';
import razorpayRoutes from './routes/razorpay.routes.js';
import globalChatRoutes from './routes/globalChat.routes.js'; // keep global chat separate

// Mounting Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/message', messageRoutes); // This includes /send, /:id1/:id2, /mark-read, /unread/:userId
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/razorpay', razorpayRoutes);
app.use('/api/global-chat', globalChatRoutes); // separate path

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Alumni Network Backend Running!');
});

export { app };
