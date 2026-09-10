import express from "express";
import { deleteTransaction } from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.delete("/:id", deleteTransaction);

export default router;
