import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Navigate, NavLink, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import CreateBillPage from "./pages/CreateBillPage";
import BillsHistoryPage from "./pages/BillsHistoryPage";
import CustomersPage from "./pages/CustomersPage";
import ItemsPage from "./pages/ItemsPage";
import GridBackground from "./components/aceternity/GridBackground";
import FloatingOrbs from "./components/aceternity/FloatingOrbs";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const isAuthenticated = useMemo(() => !!token, [token]);

  const handleLoginSuccess = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const navItems = [
    { to: "/create", label: "Create Bill" },
    { to: "/items", label: "Items" },
    { to: "/history", label: "Bills" },
    { to: "/customers", label: "Customers" },
  ];

  return (
    <Router>
      <GridBackground>
        <FloatingOrbs />
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <header className="mb-6 rounded-xl border bg-card/80 p-4 shadow-sm backdrop-blur md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-[Manrope] text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                    Holi Billing Console
                  </h1>
                  <Badge variant="success">Production</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage billing, invoices and customer records.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {navItems.map(({ to, label }) => (
                  <NavLink key={to} to={to}>
                    {({ isActive }) => (
                      <Button variant={isActive ? "default" : "outline"} size="sm">
                        {label}
                      </Button>
                    )}
                  </NavLink>
                ))}

                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="animate-in fade-in duration-500">
            <Routes>
              <Route path="/create" element={<CreateBillPage />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/history" element={<BillsHistoryPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="*" element={<Navigate to="/create" replace />} />
            </Routes>
          </main>
        </div>
      </GridBackground>
    </Router>
  );
}

export default App;
