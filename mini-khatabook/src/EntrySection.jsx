import { useState } from "react";

function EntrySection({
  amount,
  setAmount,
  date,
  setDate,
  note,
  setNote,
  addEntry
}) {
  const [type, setType] = useState("credit");

  const handleSubmit = () => {
    if (!amount || !date) return;
    addEntry(type);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Add Transaction</h3>

      {/* Amount */}
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {/* Date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {/* Note */}
      <input
        type="text"
        placeholder="Add note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {/* Transaction Type Dropdown */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ width: "100%", marginBottom: "15px" }}
      >
        <option value="credit">You Got (Credit)</option>
        <option value="debit">You Gave (Debit)</option>
      </select>

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Save Transaction
      </button>
    </div>
  );
}

export default EntrySection;