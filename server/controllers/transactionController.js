import Transaction from "../models/Transaction.js";
import Customer from "../models/Customer.js";

// @desc    Add transaction entry for a customer
// @route   POST /api/customers/:customerId/transactions
// @access  Private
export const addTransaction = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { type, amount, date, note } = req.body;

    if (!type || !amount || !date) {
      return res.status(400).json({ message: "Type, amount, and date are required" });
    }

    const customer = await Customer.findOne({
      _id: customerId,
      user: req.user._id
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const transaction = await Transaction.create({
      customer: customerId,
      user: req.user._id,
      type,
      amount: Number(amount),
      date,
      note: note || ""
    });

    res.status(201).json({
      id: transaction._id.toString(),
      _id: transaction._id.toString(),
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
      note: transaction.note
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Delete transaction entry
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ message: "Transaction deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
