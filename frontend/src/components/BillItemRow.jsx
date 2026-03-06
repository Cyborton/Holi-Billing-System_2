import React from "react";

const BillItemRow = ({
  itemsList = [],
  billItem,
  index,
  updateItem,
  removeItem,
  selectedItemIds = []
}) => {

  const handleItemChange = (e) => {
    const value = e.target.value;

    updateItem(index, {
      ...billItem,
      itemId: value === "" ? "" : parseInt(value)
    });
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);

    updateItem(index, {
      ...billItem,
      quantity: isNaN(value) ? 1 : value
    });
  };

  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>

      <select
        value={billItem.itemId}
        onChange={handleItemChange}
      >
        <option value="">Select Item</option>

        {Array.isArray(itemsList) &&
          itemsList.map((item) => {

            const isAlreadySelected =
              Array.isArray(selectedItemIds) &&
              selectedItemIds.includes(item.id) &&
              item.id !== billItem.itemId;

            return (
              <option
                key={item.id}
                value={item.id}
                disabled={isAlreadySelected}
              >
                {item.name} - ₹{item.price}
              </option>
            );
          })}
      </select>

      <input
        type="number"
        min="1"
        value={billItem.quantity}
        onChange={handleQuantityChange}
      />

      <button
        type="button"
        onClick={() => removeItem(index)}
      >
        Remove
      </button>

    </div>
  );
};

export default BillItemRow;