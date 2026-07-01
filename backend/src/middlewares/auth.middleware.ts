// backend/src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Format token salah' });
    }

    // Verifikasi token
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    
    // Simpan data user ke request
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Token tidak valid' });
  }
};

// Export default untuk kemudahan
export default authMiddleware;