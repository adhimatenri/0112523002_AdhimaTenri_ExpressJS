// backend/src/server.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mahasiswaRoutes from './routes/mahasiswa.route';
import path from 'path'; // ✅ Tambahkan ini

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files untuk akses foto
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend Express API is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      mahasiswa: '/api/mahasiswa',
      uploads: '/uploads'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/mahasiswa', mahasiswaRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.url
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`📡 API: http://localhost:${PORT}/api/mahasiswa`);
  console.log(`🖼️ Uploads: http://localhost:${PORT}/uploads\n`);
});