import http from 'http';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { validateEnv } from './config/validateEnv.js';
import app from './app.js';
import { initRealtime } from './realtime.js';

dotenv.config();

// Validate environment variables before starting
validateEnv();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

let ioInstance = null;

export function getIO() {
  return ioInstance;
}

async function startServer() {
  try {
    // Connect to database first
    await connectDB();
    console.log('✅ Database connection established');

    // Initialize socket.io
    ioInstance = initRealtime(server);
    
    // Attach io to app for use in routes
    app.set('io', ioInstance);

    // Start server with error handling for port conflicts
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please stop the other process or use a different port.`);
        console.error('💡 Try: Get-Process node | Stop-Process -Force');
      } else {
        console.error('❌ Server error:', err.message);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
  server.close(() => process.exit(1));
});

process.on('SIGINT', () => {
  console.log('SIGINT received: closing server');
  server.close(() => process.exit(0));
});
