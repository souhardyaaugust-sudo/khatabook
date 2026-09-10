import { useState, useEffect } from "react";
import CustomerPanel from "./CustomerPanel";
import EntrySection from "./EntrySection";
import EntryList from "./EntryList";
import AuthModal from "./AuthModal";
import {
  apiLogin,
  apiRegister,
  apiGetMe,
  apiGetCustomers,
  apiAddCustomer,
  apiDeleteCustomer,
  apiAddTransaction,
  apiDeleteTransaction
} from "./api";

function App() {
  /* ===============================
     AUTH & STATE SECTION
     =============================== */

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authError, setAuthError] = useState("");

  // Customers data from backend API
  const [customers, setCustomers] = useState([]);

  // Input field for adding new customer
  const [customerName, setCustomerName] = useState("");

  // Selected customer ID
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Input fields for credit/debit entry
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  /* ===============================
     EFFECT SECTION
     =============================== */

  // On initial mount or token change, fetch user & customers
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);

      // Verify token & fetch user if not already set
      if (!user) {
        apiGetMe(token)
          .then((userData) => {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          })
          .catch((err) => {
            console.error(err);
            handleLogout();
          });
      }

      // Fetch customers for logged-in user
      apiGetCustomers(token)
        .then((data) => {
          setCustomers(data);
        })
        .catch((err) => {
          console.error("Failed to load customers:", err);
          if (err.message.includes("authorized") || err.message.includes("token")) {
            handleLogout();
          }
        });
    } else {
      setCustomers([]);
      setSelectedCustomerId(null);
    }
  }, [token]);

  /* ===============================
     AUTH HANDLERS
     =============================== */

  const handleLogin = async (email, password) => {
    try {
      setAuthError("");
      const data = await apiLogin(email, password);
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      setAuthError("");
      const data = await apiRegister(name, email, password);
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCustomers([]);
    setSelectedCustomerId(null);
  };

  /* ===============================
     CUSTOMER OPERATIONS
     =============================== */

  const addCustomer = async () => {
    if (!customerName.trim()) return;

    try {
      const newCustomer = await apiAddCustomer(token, customerName);
      setCustomers([newCustomer, ...customers]);
      setCustomerName("");
      if (!selectedCustomerId) {
        setSelectedCustomerId(newCustomer.id || newCustomer._id);
      }
    } catch (err) {
      alert("Error adding customer: " + err.message);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await apiDeleteCustomer(token, id);
      setCustomers(customers.filter((c) => (c.id || c._id) !== id));
      if (id === selectedCustomerId) {
        setSelectedCustomerId(null);
      }
    } catch (err) {
      alert("Error deleting customer: " + err.message);
    }
  };

  /* ===============================
     DERIVED DATA (NO STATE STORED)
     =============================== */

  const selectedCustomer = customers.find(
    (c) => (c.id || c._id) === selectedCustomerId
  );

  const totals = selectedCustomer
    ? selectedCustomer.entries.reduce(
        (acc, entry) => {
          if (entry.type === "credit") {
            acc.credit += entry.amount;
          } else {
            acc.debit += entry.amount;
          }
          return acc;
        },
        { credit: 0, debit: 0 }
      )
    : { credit: 0, debit: 0 };

  const balance = totals.credit - totals.debit;

  const overallTotals = customers.reduce(
    (acc, customer) => {
      customer.entries.forEach((entry) => {
        if (entry.type === "credit") {
          acc.credit += entry.amount;
        } else {
          acc.debit += entry.amount;
        }
      });
      return acc;
    },
    { credit: 0, debit: 0 }
  );

  const overallBalance = overallTotals.credit - overallTotals.debit;

  /* ===============================
     ENTRY OPERATIONS
     =============================== */

  const addEntry = async (type) => {
    if (!selectedCustomerId || !amount || !date) return;

    try {
      const newEntry = await apiAddTransaction(token, selectedCustomerId, {
        type,
        amount: Number(amount),
        date,
        note
      });

      setCustomers(
        customers.map((customer) => {
          const custId = customer.id || customer._id;
          if (custId === selectedCustomerId) {
            return {
              ...customer,
              entries: [...customer.entries, newEntry]
            };
          }
          return customer;
        })
      );

      setAmount("");
      setDate("");
      setNote("");
    } catch (err) {
      alert("Error saving transaction: " + err.message);
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      await apiDeleteTransaction(token, entryId);

      setCustomers(
        customers.map((customer) => {
          const custId = customer.id || customer._id;
          if (custId === selectedCustomerId) {
            return {
              ...customer,
              entries: customer.entries.filter(
                (entry) => (entry.id || entry._id) !== entryId
              )
            };
          }
          return customer;
        })
      );
    } catch (err) {
      alert("Error deleting entry: " + err.message);
    }
  };

  /* ===============================
     UI RENDER SECTION
     =============================== */

  if (!token) {
    return (
      <div className="app-container">
        <h1 className="app-title" style={{ textAlign: "center", marginBottom: "10px" }}>
          Mini Khatabook
        </h1>
        <AuthModal
          onLogin={handleLogin}
          onRegister={handleRegister}
          authError={authError}
          clearError={() => setAuthError("")}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Header Bar */}
      <div className="header-bar">
        <h1 className="app-title">Mini Khatabook</h1>
        <div className="user-info">
          <span className="user-name">Welcome, {user ? user.name : "User"}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="overall-summary">
        <h3>Overall Summary</h3>
        <p>Total Credit: ₹{overallTotals.credit}</p>
        <p>Total Debit: ₹{overallTotals.debit}</p>

        <h3 style={{ color: overallBalance >= 0 ? "green" : "red", marginTop: "5px" }}>
          Net Balance: ₹{overallBalance}
        </h3>
      </div>

      {/* Two-column layout */}
      <div className="layout">
        {/* LEFT SIDE - Customer List */}
        <CustomerPanel
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
          deleteCustomer={deleteCustomer}
          customerName={customerName}
          setCustomerName={setCustomerName}
          addCustomer={addCustomer}
        />

        {/* RIGHT SIDE - Selected Customer Details */}
        <div className="right-panel">
          {selectedCustomer ? (
            <>
              <h2>{selectedCustomer.name}</h2>

              {/* Entry input section */}
              <EntrySection
                amount={amount}
                setAmount={setAmount}
                addEntry={addEntry}
                date={date}
                setDate={setDate}
                note={note}
                setNote={setNote}
              />

              {/* Entry list + totals */}
              <EntryList
                selectedCustomer={selectedCustomer}
                balance={balance}
                deleteEntry={deleteEntry}
                totals={totals}
              />
            </>
          ) : (
            <p>Select a customer to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;