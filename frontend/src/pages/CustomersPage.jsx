import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/customers");
        setCustomers(Array.isArray(res.data) ? res.data : []);
      } catch {
        setCustomers([]);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(
    () =>
      customers.filter((c) => {
        const keyword = search.toLowerCase();
        return (
          c.id?.toString().includes(keyword) ||
          (c.name || "").toLowerCase().includes(keyword) ||
          (c.phone || "").includes(search) ||
          (c.email || "").toLowerCase().includes(keyword)
        );
      }),
    [customers, search]
  );

  return (
    <Card className="border-slate-200/90 bg-card/90">
      <CardHeader>
        <CardTitle className="font-[Manrope]">Customers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-sm">
          <Input
            placeholder="Search customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone || "-"}</TableCell>
                <TableCell>{customer.email || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CustomersPage;
