import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import ThermalReceipt from "../components/ThermalReceipt";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";

const formatINR = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const CreateBillPage = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("catalog");
  const [customer, setCustomer] = useState({ customerName: "", phone: "", email: "" });
  const [createdBill, setCreatedBill] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoadingItems(true);
        const res = await api.get("/items");
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch {
        setError("Failed to load products.");
      } finally {
        setLoadingItems(false);
      }
    };

    loadItems();
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              quantity: Math.max(1, c.quantity + delta),
            }
          : c
      )
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const subtotal = useMemo(
    () => cart.reduce((acc, i) => acc + Number(i.price) * Number(i.quantity), 0),
    [cart]
  );
  const gst = useMemo(() => subtotal * 0.18, [subtotal]);
  const total = useMemo(() => subtotal + gst, [subtotal, gst]);

  const checkout = async () => {
    if (!customer.customerName.trim() || !customer.phone.trim()) {
      setError("Customer name and phone are required.");
      return;
    }

    if (!cart.length) {
      setError("Add at least one product to cart.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const payload = {
        ...customer,
        items: cart.map((c) => ({ itemId: c.id, quantity: c.quantity })),
      };

      const res = await api.post("/bills", payload);
      setCreatedBill(res.data);
      setCart([]);
    } catch {
      setError("Failed to create bill.");
    } finally {
      setSubmitting(false);
    }
  };

  if (createdBill) {
    return <ThermalReceipt bill={createdBill} onBack={() => setCreatedBill(null)} />;
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/90 bg-card/90">
        <CardHeader>
          <CardTitle className="font-[Manrope]">Customer Details</CardTitle>
          <CardDescription>Provide billing details before checkout.</CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={customer.customerName}
              placeholder="Riya Sharma"
              onChange={(e) => setCustomer((prev) => ({ ...prev, customerName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={customer.phone}
              placeholder="9876543210"
              onChange={(e) => setCustomer((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={customer.email}
              placeholder="customer@example.com"
              onChange={(e) => setCustomer((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant={activeTab === "catalog" ? "default" : "outline"} onClick={() => setActiveTab("catalog")}>Product Catalog</Button>
        <Button variant={activeTab === "cart" ? "default" : "outline"} onClick={() => setActiveTab("cart")}>Cart</Button>
      </div>

      {activeTab === "catalog" ? (
        <Card className="border-slate-200/90 bg-card/90">
          <CardHeader>
            <CardTitle className="font-[Manrope]">Select Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingItems ? (
              <p className="text-sm text-muted-foreground">Loading products...</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <div key={item.id} className="rounded-lg border bg-background p-4 transition hover:shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-medium">{item.name}</div>
                      <Badge variant="outline">{formatINR(item.price)}</Badge>
                    </div>
                    <Button size="sm" className="w-full" onClick={() => addToCart(item)}>
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200/90 bg-card/90">
          <CardHeader>
            <CardTitle className="font-[Manrope]">Cart Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!cart.length ? (
              <p className="text-sm text-muted-foreground">No items in cart.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border bg-background p-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatINR(item.price)} each</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => updateQty(item.id, -1)}>
                      -
                    </Button>
                    <Badge variant="secondary">{item.quantity}</Badge>
                    <Button size="icon" variant="outline" onClick={() => updateQty(item.id, 1)}>
                      +
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>{formatINR(gst)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Grand Total</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

            <Button className="w-full" size="lg" onClick={checkout} disabled={submitting || !cart.length}>
              {submitting ? "Processing..." : "Create Bill"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreateBillPage;
