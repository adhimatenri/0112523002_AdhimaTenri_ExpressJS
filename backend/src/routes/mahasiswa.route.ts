// backend/src/routes/mahasiswa.route.ts

import { Router } from "express";
import {
  getAllMahasiswa,
  getMahasiswaById,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/mahasiswa.controller";
import { uploadFotoMahasiswa } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getAllMahasiswa);
router.get("/:id", getMahasiswaById);

// ✅ Tambahkan upload middleware untuk POST dan PUT
router.post("/", uploadFotoMahasiswa.single("foto"), createMahasiswa);
router.put("/:id", uploadFotoMahasiswa.single("foto"), updateMahasiswa);
router.delete("/:id", deleteMahasiswa);

export default router;