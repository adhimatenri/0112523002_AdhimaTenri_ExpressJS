import { Router, Request, Response } from "express";
import { mahasiswa, Mahasiswa } from "../data/mahasiswa.data";

const router = Router();

// READ ALL
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Data mahasiswa berhasil diambil",
    data: mahasiswa,
  });
});

// READ DETAIL
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = mahasiswa.find((item) => item.id === id);

  if (!data) {
    return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
  }

  res.json({
    message: "Detail mahasiswa berhasil diambil",
    data,
  });
});

// CREATE
router.post("/", (req: Request, res: Response) => {
  const { nim, nama, prodi, angkatan } = req.body;

  if (!nim || !nama || !prodi || !angkatan) {
    return res.status(400).json({
      message: "NIM, nama, prodi, dan angkatan wajib diisi",
    });
  }

  const newMahasiswa: Mahasiswa = {
    id: mahasiswa.length + 1,
    nim,
    nama,
    prodi,
    angkatan: Number(angkatan),
  };

  mahasiswa.push(newMahasiswa);

  res.status(201).json({
    message: "Mahasiswa berhasil ditambahkan",
    data: newMahasiswa,
  });
});

// UPDATE
router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nim, nama, prodi, angkatan } = req.body;

  const index = mahasiswa.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
  }

  mahasiswa[index] = {
    id,
    nim,
    nama,
    prodi,
    angkatan: Number(angkatan),
  };

  res.json({
    message: "Mahasiswa berhasil diperbarui",
    data: mahasiswa[index],
  });
});

// DELETE
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = mahasiswa.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
  }

  const deletedData = mahasiswa.splice(index, 1);

  res.json({
    message: "Mahasiswa berhasil dihapus",
    data: deletedData[0],
  });
});

export default router;