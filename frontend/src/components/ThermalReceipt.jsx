import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const formatINR = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const ThermalReceipt = ({ bill, onBack }) => {
  const handlePrint = () => window.print();

  return (
    <div className="mx-auto max-w-xl">
      <Card className="border-slate-200/90 bg-card/95">
        <CardHeader>
          <CardTitle className="font-[Manrope]">Receipt #{bill.id}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <p>
            <span className="font-medium">Date:</span> {new Date(bill.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Customer:</span> {bill.customer?.name}
          </p>

          <Separator />

          {(bill.items || []).map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>{formatINR(item.total)}</span>
            </div>
          ))}

          <Separator />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(bill.subTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST</span>
              <span>{formatINR(bill.gst)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatINR(bill.grandTotal)}</span>
            </div>
          </div>

          <p className="pt-2 text-center text-muted-foreground">Thank you for your business.</p>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={handlePrint}>Print Slip</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThermalReceipt;
