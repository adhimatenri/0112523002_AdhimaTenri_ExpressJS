import express, { Request, Response } from "express";
import cors from "cors";
import app from "./app";

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Server Express.js berjalan",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Express CRUD API",
  });
});

app.get("/profile", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Data Profile",
  });
});

app.get("/about", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Data About",
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});


