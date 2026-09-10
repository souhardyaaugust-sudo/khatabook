import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0
    },
    date: {
      type: String,
      required: [true, "Date is required"]
    },
    note: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
