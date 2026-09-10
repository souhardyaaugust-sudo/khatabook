function EntryList({ selectedCustomer, balance, deleteEntry, totals }) {
  if (!selectedCustomer) return null;

  return (
    <div>
      <h3>Entries for {selectedCustomer.name}</h3>

      {selectedCustomer.entries.length === 0 ? (
        <p>No entries yet</p>
      ) : (
        <ul>
          {selectedCustomer.entries.map((entry, index) => {
            const entryId = entry.id || entry._id || index;
            return (
              <li
                key={entryId}
                style={{
                  marginBottom: "12px",
                  padding: "8px",
                  background: "white",
                  borderRadius: "6px"
                }}
              >
                <strong>
                  {entry.type === "credit" ? "+" : "-"} ₹{entry.amount}
                </strong>

                <div style={{ fontSize: "13px", color: "#555" }}>
                  Date: {entry.date}
                </div>

                {entry.note && (
                  <div style={{ fontSize: "13px" }}>
                    Note: {entry.note}
                  </div>
                )}

                <button
                  onClick={() => deleteEntry(entryId)}
                  style={{ marginTop: "6px", backgroundColor: "#ef4444", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <hr style={{ margin: "15px 0" }} />

      <p>Total Credit: ₹{totals.credit}</p>
      <p>Total Debit: ₹{totals.debit}</p>

      <h3
        style={{
          color: balance >= 0 ? "green" : "red",
          marginTop: "10px"
        }}
      >
        Net Balance: ₹{balance}
      </h3>
    </div>
  );
}

export default EntryList;