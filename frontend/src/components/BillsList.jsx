import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const BillsList = ({ bills = [] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bills.map((bill) => (
          <TableRow key={bill.id}>
            <TableCell>{bill.id}</TableCell>
            <TableCell>{bill.customer?.name || "-"}</TableCell>
            <TableCell>{bill.grandTotal}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BillsList;
