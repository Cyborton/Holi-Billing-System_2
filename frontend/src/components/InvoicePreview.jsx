import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const formatINR = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const InvoicePreview = ({ invoice }) => {
  const handlePrint = () => window.print();

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("HOLI BILLING SYSTEM", 14, 20);
    doc.setFontSize(11);
    doc.text(`Invoice ID: ${invoice.id}`, 14, 30);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`, 14, 37);
    doc.text(`Customer: ${invoice.customer?.name || "-"}`, 14, 44);
    doc.text(`Phone: ${invoice.customer?.phone || "-"}`, 14, 51);

    autoTable(doc, {
      startY: 58,
      head: [["Item", "Qty", "Price", "Total"]],
      body: (invoice.items || []).map((item) => [
        item.name,
        item.quantity,
        formatINR(item.price),
        formatINR(item.total),
      ]),
    });

    const afterTable = doc.lastAutoTable?.finalY || 100;
    doc.text(`Subtotal: ${formatINR(invoice.subTotal)}`, 14, afterTable + 10);
    doc.text(`GST (18%): ${formatINR(invoice.gst)}`, 14, afterTable + 17);
    doc.text(`Grand Total: ${formatINR(invoice.grandTotal)}`, 14, afterTable + 24);

    doc.save(`Invoice_${invoice.id}.pdf`);
  };

  return (
    <Card className="border-slate-200 bg-card">
      <CardHeader>
        <CardTitle className="font-[Manrope]">Invoice #{invoice.id}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <p>
            <span className="font-medium">Date:</span> {new Date(invoice.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Customer:</span> {invoice.customer?.name}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {invoice.customer?.phone || "-"}
          </p>
          <p>
            <span className="font-medium">Email:</span> {invoice.customer?.email || "-"}
          </p>
        </div>

        <Separator />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(invoice.items || []).map((item, index) => (
              <TableRow key={`${item.name}-${index}`}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatINR(item.price)}</TableCell>
                <TableCell>{formatINR(item.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="ml-auto max-w-xs space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatINR(invoice.subTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span>{formatINR(invoice.gst)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Grand Total</span>
            <span>{formatINR(invoice.grandTotal)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrint}>
            Print
          </Button>
          <Button onClick={handleDownload}>Download PDF</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicePreview;
