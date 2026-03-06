import React, { useEffect, useState } from "react";
import api from "../api/api";
import CustomerForm from "./CustomerForm";
import BillItemRow from "./BillItemRow";

const BillForm = ({ onSubmit }) => {
  const [customer, setCustomer] = useState({
    customerName: "",
    phone: "",
    email: ""
  });

  const [itemsList, setItemsList] = useState([]);
  const [billItems, setBillItems] = useState([
    { itemId: "", quantity: 1 }
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get("/items");
      setItemsList(response.data || []);
    } catch {
      alert("Failed to load items");
    }
  };

  const addItemRow = () => {
    setBillItems([...billItems, { itemId: "", quantity: 1 }]);
  };

  const updateItem = (index, updatedItem) => {
    const updated = [...billItems];
    updated[index] = updatedItem;
    setBillItems(updated);
  };

  const removeItem = (index) => {
    if (billItems.length === 1) return;
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!customer.customerName) {
      alert("Customer name required");
      return;
    }

    if (billItems.some(item => !item.itemId)) {
      alert("Please select all items");
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        ...customer,
        items: billItems
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create Bill</h2>

      <CustomerForm
        customer={customer}
        setCustomer={setCustomer}
      />

      <div style={{ marginTop: "15px" }}>
        {billItems.map((item, index) => (
          <BillItemRow
            key={index}
            index={index}
            itemsList={itemsList}
            billItem={item}
            updateItem={updateItem}
            removeItem={removeItem}
            selectedItemIds={billItems.map(i => i.itemId)}
          />
        ))}
      </div>

      <button
        className="btn btn-secondary"
        onClick={addItemRow}
        style={{ marginTop: "10px" }}
      >
        + Add Item
      </button>

      <div style={{ marginTop: "20px" }}>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Bill"}
        </button>
      </div>
    </div>
  );
};

export default BillForm;