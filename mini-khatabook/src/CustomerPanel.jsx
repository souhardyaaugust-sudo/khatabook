function CustomerPanel({
  customers,
  selectedCustomerId,
  setSelectedCustomerId,
  deleteCustomer,
  customerName,
  setCustomerName,
  addCustomer
}) {
  return (
    <div className="customer-panel">
      <h3>Customers</h3>

      <input
        type="text"
        placeholder="Enter customer name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />
      <button onClick={addCustomer}>Add</button>

      <ul>
        {customers.map((customer) => {
          const custId = customer.id || customer._id;
          return (
            <li
              key={custId}
              onClick={() => setSelectedCustomerId(custId)}
              className={
                custId === selectedCustomerId
                  ? "customer active"
                  : "customer"
              }
            >
              {customer.name}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCustomer(custId);
                }}
              >
                X
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CustomerPanel;