import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import InvoicePreview from "../components/InvoicePreview";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const formatINR = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const BillsHistoryPage = () => {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await api.get("/bills");
        setBills(Array.isArray(res.data) ? res.data : []);
      } catch {
        setBills([]);
      }
    };

    fetchBills();
  }, []);

  const filteredBills = useMemo(
    () =>
      bills.filter((b) => {
        const keyword = search.toLowerCase();
        return (
          b.id?.toString().includes(keyword) ||
          (b.customer?.name || "").toLowerCase().includes(keyword) ||
          (b.customer?.phone || "").includes(search)
        );
      }),
    [bills, search]
  );

  if (selectedBill) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedBill(null)}>
          Back to Bills
        </Button>
        <InvoicePreview invoice={selectedBill} />
      </div>
    );
  }

  return (
    <Card className="border-slate-200/90 bg-card/90">
      <CardHeader>
        <CardTitle className="font-[Manrope]">Bills History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-sm">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by bill ID, name or phone"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill ID</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.id}</TableCell>
                <TableCell>{new Date(bill.createdAt).toLocaleString()}</TableCell>
                <TableCell>{bill.customer?.name}</TableCell>
                <TableCell>{bill.customer?.phone || "-"}</TableCell>
                <TableCell>{formatINR(bill.grandTotal)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setSelectedBill(bill)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BillsHistoryPage;
