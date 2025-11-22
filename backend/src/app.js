import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// 👇 Import your routers
import progressRoutes from './routes/progress.js';
import reportsRouter from './routes/reports.js';
import commentsRouter from './routes/comments.js';
import authRouter from './routes/auth.js';
import statsRouter from './routes/stats.js';
import dailyTasksRouter from './routes/dailyTasks.js';

const app = express();

// ✅ Trust proxy so rate-limit works correctly behind Render/Vercel
app.set('trust proxy', 1);

// Security middleware - must be first
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images from Cloudinary
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Apply rate limiting
app.use('/api/', limiter);
// Middleware to attach io to requests (if available)
app.use((req, res, next) => {
  req.io = app.get('io');
  next();
});

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EcoEdu backend running' });
});

// 👇 Mount feature routes
app.use('/api/auth', authLimiter, authRouter); // Stricter rate limiting for auth
app.use('/api/reports', reportsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/progress', progressRoutes);
app.use('/api/stats', statsRouter);
app.use('/api/daily-tasks', dailyTasksRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't expose internal error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({
    message: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack }),
  });
});

export default app;