import express from "express";
import cors from "cors";
import path from "path";

import mahasiswaRoutes from './routes/mahasiswa.route';
import authRoutes from './routes/auth.route';
import prodiRoutes from './routes/prodi.route';

 
const app = express();
 
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files untuk upload
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes - PASTIKAN PREFIX /api
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/prodi', prodiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

export default app;