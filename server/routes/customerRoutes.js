import express from "express";
import {
  getCustomers,
  addCustomer,
  deleteCustomer
} from "../controllers/customerController.js";
import { addTransaction } from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getCustomers).post(addCustomer);
router.route("/:id").delete(deleteCustomer);

// Add transaction endpoint nested under customer
router.post("/:customerId/transactions", addTransaction);

export default router;
