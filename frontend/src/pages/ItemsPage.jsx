import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const formatINR = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const emptyForm = { name: "", price: "" };

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/items");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      setItems([]);
      setError("Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const keyword = search.toLowerCase();
        return item.id?.toString().includes(keyword) || (item.name || "").toLowerCase().includes(keyword);
      }),
    [items, search]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const toPayload = () => ({
    name: form.name.trim(),
    price: Number(form.price),
  });

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Item name is required.");
      return false;
    }

    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      setError("Price must be greater than 0.");
      return false;
    }

    return true;
  };

  const saveItem = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError("");
      const payload = toPayload();

      if (editingId) {
        await api.put(`/items/${editingId}`, { id: editingId, ...payload });
      } else {
        await api.post("/items", payload);
      }

      resetForm();
      await loadItems();
    } catch (err) {
      setError(err?.response?.data || "Failed to save item.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name || "", price: String(item.price ?? "") });
    setError("");
  };

  const deleteItem = async (id) => {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/items/${id}`);
      await loadItems();
    } catch {
      setError("Failed to delete item.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/90 bg-card/90">
        <CardHeader>
          <CardTitle className="font-[Manrope]">{editingId ? "Edit Item" : "Add Item"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="itemName">Name</Label>
              <Input
                id="itemName"
                placeholder="Organic Gulal - Pink (250g)"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemPrice">Price</Label>
              <Input
                id="itemPrice"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="95"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={saveItem} disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Item" : "Create Item"}
              </Button>
              {editingId ? (
                <Button variant="outline" onClick={resetForm} disabled={saving}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        </CardContent>
      </Card>

      <Card className="border-slate-200/90 bg-card/90">
        <CardHeader>
          <CardTitle className="font-[Manrope]">Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-sm">
            <Input placeholder="Search item" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading items...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{formatINR(item.price)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemsPage;
