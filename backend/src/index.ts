import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { authRoutes, applicationRoutes } from './routes';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Parse incoming JSON request bodies, including small resume attachments encoded by the frontend
app.use(express.json({ limit: '5mb' }));

// Enable CORS for frontend origin
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Health-check route
app.get('/api/health', (_req, res) => {
  console.log('[health] Health check ping received');
  res.json({ status: 'ok', message: 'Job Tracker API is running' });
});

// Mount auth routes — /api/auth/*
app.use('/api/auth', authRoutes);

// Mount application routes — /api/applications/*
app.use('/api/applications', applicationRoutes);

// Connect to MongoDB then start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[server] Running on http://localhost:${PORT}`);
  });
});

export default app;
