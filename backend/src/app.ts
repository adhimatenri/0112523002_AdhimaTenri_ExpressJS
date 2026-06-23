import express from "express";
import cors from "cors";
import mahasiswaRoutes from "./routes/mahasiswa.route";
import mahasiswaDbRoutes from "./routes/mahasiswa-db.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Express CRUD berjalan" });
});

app.use("/api/mahasiswa", mahasiswaRoutes);
app.use("/api/db/mahasiswa", mahasiswaDbRoutes);



export default app;