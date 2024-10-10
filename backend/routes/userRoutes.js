import express from "express";
import {
  allUsers,
  authUser,
  registerUser,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, allUsers);

router.post("/", registerUser);
router.post("/login", authUser);

export default router;
