// backend/src/controllers/mahasiswa.controller.ts

import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Mahasiswa {
  id?: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  foto?: string | null;
  created_at?: Date;
}

// GET all mahasiswa
export const getAllMahasiswa = async (req: Request, res: Response) => {
  try {
    const { search, prodi, angkatan, page = 1, limit = 10 } = req.query;
    
    let query = `SELECT * FROM mahasiswa WHERE 1=1`;
    const values: any[] = [];
    
    if (search) {
      query += ` AND (nim LIKE ? OR nama LIKE ?)`;
      values.push(`%${search}%`, `%${search}%`);
    }
    
    if (prodi) {
      query += ` AND prodi LIKE ?`;
      values.push(`%${prodi}%`);
    }
    
    if (angkatan) {
      query += ` AND angkatan = ?`;
      values.push(angkatan);
    }
    
    const offset = (Number(page) - 1) * Number(limit);
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    values.push(Number(limit), offset);
    
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    
    // Hitung total
    let countQuery = `SELECT COUNT(*) as total FROM mahasiswa WHERE 1=1`;
    const countValues: any[] = [];
    
    if (search) {
      countQuery += ` AND (nim LIKE ? OR nama LIKE ?)`;
      countValues.push(`%${search}%`, `%${search}%`);
    }
    if (prodi) {
      countQuery += ` AND prodi LIKE ?`;
      countValues.push(`%${prodi}%`);
    }
    if (angkatan) {
      countQuery += ` AND angkatan = ?`;
      countValues.push(angkatan);
    }
    
    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, countValues);
    const total = countResult[0]?.total || 0;

    res.json({
      data: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error getAllMahasiswa:', error);
    res.status(500).json({ error: 'Gagal mengambil data mahasiswa' });
  }
};

// GET mahasiswa by ID
export const getMahasiswaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM mahasiswa WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error getMahasiswaById:', error);
    res.status(500).json({ error: 'Gagal mengambil data mahasiswa' });
  }
};

// ✅ CREATE mahasiswa dengan foto
export const createMahasiswa = async (req: Request, res: Response) => {
  try {
    const { nim, nama, prodi, angkatan } = req.body;
    
    // Ambil file dari multer
    const foto = req.file;
    const fotoPath = foto ? `/uploads/${foto.filename}` : null;

    // Validasi
    if (!nim || !nama || !prodi || !angkatan) {
      return res.status(400).json({ 
        error: 'NIM, Nama, Prodi, dan Angkatan harus diisi' 
      });
    }

    // Cek NIM duplicate
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM mahasiswa WHERE nim = ?',
      [nim]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'NIM sudah terdaftar' });
    }

    // Insert data dengan foto
    const query = `
      INSERT INTO mahasiswa (nim, nama, prodi, angkatan, foto) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query<ResultSetHeader>(query, [
      nim,
      nama,
      prodi,
      angkatan,
      fotoPath
    ]);

    // Ambil data yang baru diinsert
    const [newData] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM mahasiswa WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Mahasiswa berhasil ditambahkan',
      data: newData[0],
    });
  } catch (error) {
    console.error('Error createMahasiswa:', error);
    res.status(500).json({ error: 'Gagal menambahkan data mahasiswa' });
  }
};

// ✅ UPDATE mahasiswa dengan foto
export const updateMahasiswa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nim, nama, prodi, angkatan } = req.body;
    
    // Ambil file dari multer (jika ada)
    const foto = req.file;
    const fotoPath = foto ? `/uploads/${foto.filename}` : undefined;

    // Cek mahasiswa exists
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM mahasiswa WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' });
    }

    // Cek NIM duplicate jika NIM diubah
    if (nim && nim !== existing[0].nim) {
      const [duplicate] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM mahasiswa WHERE nim = ? AND id != ?',
        [nim, id]
      );
      
      if (duplicate.length > 0) {
        return res.status(400).json({ error: 'NIM sudah terdaftar' });
      }
    }

    // Build update query
    let updateQuery = 'UPDATE mahasiswa SET ';
    const updateValues: any[] = [];
    const fields: string[] = [];

    if (nim) { fields.push('nim = ?'); updateValues.push(nim); }
    if (nama) { fields.push('nama = ?'); updateValues.push(nama); }
    if (prodi) { fields.push('prodi = ?'); updateValues.push(prodi); }
    if (angkatan) { fields.push('angkatan = ?'); updateValues.push(angkatan); }
    if (fotoPath) { 
      fields.push('foto = ?'); 
      updateValues.push(fotoPath);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Tidak ada data yang diupdate' });
    }

    updateQuery += fields.join(', ') + ' WHERE id = ?';
    updateValues.push(id);

    await pool.query<ResultSetHeader>(updateQuery, updateValues);

    // Ambil data yang sudah diupdate
    const [updatedData] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM mahasiswa WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Mahasiswa berhasil diupdate',
      data: updatedData[0],
    });
  } catch (error) {
    console.error('Error updateMahasiswa:', error);
    res.status(500).json({ error: 'Gagal mengupdate data mahasiswa' });
  }
};

// DELETE mahasiswa
export const deleteMahasiswa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Cek mahasiswa exists
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM mahasiswa WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' });
    }

    await pool.query('DELETE FROM mahasiswa WHERE id = ?', [id]);

    res.json({ message: 'Mahasiswa berhasil dihapus' });
  } catch (error) {
    console.error('Error deleteMahasiswa:', error);
    res.status(500).json({ error: 'Gagal menghapus data mahasiswa' });
  }
};