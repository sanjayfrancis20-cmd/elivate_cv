import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resume_builder';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-openai-key']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health / Status endpoint
app.get('/api/status', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: {
      driver: 'Mongoose / Hybrid Fallback',
      status: mongoStatus,
      mode: mongoStatus === 'connected' ? 'MongoDB' : 'Local JSON Persistence (Hybrid Active)'
    },
    openai: {
      serverKeyConfigured: !!process.env.OPENAI_API_KEY,
      fallbackEngineActive: true
    }
  });
});

// Routes
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);

// Database Connection with graceful hybrid fallback
let isDbConnected = false;
async function connectDB() {
  try {
    mongoose.set('strictQuery', false);
    // Connect with a fast timeout so startup doesn't hang if local mongod is not running
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    isDbConnected = true;
    console.log(` Connected to MongoDB at: ${MONGODB_URI}`);
  } catch (err) {
    console.warn(`[Hybrid Database Notice]: Could not connect to MongoDB (${err.message}).`);
    console.log(`>> Resumes will persist seamlessly using the built-in Local Storage system! <<`);
  }
}

connectDB();

app.listen(PORT, () => {
  console.log(` Resume Builder Server running on http://localhost:${PORT}`);
});
