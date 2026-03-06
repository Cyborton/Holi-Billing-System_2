import React, { useState } from "react";
import api from "../api/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import GridBackground from "../components/aceternity/GridBackground";
import FloatingOrbs from "../components/aceternity/FloatingOrbs";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.post("/auth/login", { username, password });
      onLoginSuccess(response.data.token);
    } catch {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GridBackground>
      <FloatingOrbs />
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="animate-in fade-in slide-in-from-bottom-1 duration-500">
          <Card className="w-full max-w-md border-slate-200/80 bg-card/90 shadow-xl backdrop-blur">
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto rounded-full bg-slate-900 px-3 py-2 text-white">AUTH</div>
              <CardTitle className="font-[Manrope] text-2xl text-slate-900">Holi Billing Portal</CardTitle>
              <CardDescription>Sign in to continue to billing operations</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  placeholder="admin"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

              <Button className="w-full" onClick={handleLogin} disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </GridBackground>
  );
};

export default Login;
