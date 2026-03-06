import React from "react";

const CustomerForm = ({ customer, setCustomer }) => {
  return (
    <div className="card">
      <h3>Customer Details</h3>

      <input
        type="text"
        placeholder="Customer Name"
        value={customer.customerName}
        onChange={(e) =>
          setCustomer({ ...customer, customerName: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Phone"
        value={customer.phone}
        onChange={(e) =>
          setCustomer({ ...customer, phone: e.target.value })
        }
      />

      <input
        type="email"
        placeholder="Email"
        value={customer.email}
        onChange={(e) =>
          setCustomer({ ...customer, email: e.target.value })
        }
      />
    </div>
  );
};

export default CustomerForm;