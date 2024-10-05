import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

connectDB();
const app = express();
dotenv.config();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola ");
});

app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
