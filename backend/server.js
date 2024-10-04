import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

connectDB();
const app = express();
dotenv.config();

app.get("/", (req, res) => {
  res.send("Hola ");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
