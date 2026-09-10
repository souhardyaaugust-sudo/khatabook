import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";

// @desc    Get all customers with their entries for the logged-in user
// @route   GET /api/customers
// @access  Private
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Fetch transactions for each customer
    const customersWithEntries = await Promise.all(
      customers.map(async (cust) => {
        const entries = await Transaction.find({
          customer: cust._id,
          user: req.user._id
        }).sort({ createdAt: 1 });

        return {
          id: cust._id.toString(),
          _id: cust._id.toString(),
          name: cust.name,
          entries: entries.map((entry) => ({
            id: entry._id.toString(),
            _id: entry._id.toString(),
            type: entry.type,
            amount: entry.amount,
            date: entry.date,
            note: entry.note
          }))
        };
      })
    );

    res.json(customersWithEntries);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Add a new customer
// @route   POST /api/customers
// @access  Private
export const addCustomer = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Customer name is required" });
    }

    const customer = await Customer.create({
      user: req.user._id,
      name: name.trim()
    });

    res.status(201).json({
      id: customer._id.toString(),
      _id: customer._id.toString(),
      name: customer.name,
      entries: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Delete a customer and their entries
// @route   DELETE /api/customers/:id
// @access  Private
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Delete associated transactions
    await Transaction.deleteMany({ customer: customer._id, user: req.user._id });
    await Customer.findByIdAndDelete(customer._id);

    res.json({ message: "Customer and associated entries deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
