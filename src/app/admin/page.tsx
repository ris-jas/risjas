"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ADMIN_PANEL_PATH } from "@/lib/admin-path";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);

    try {
      const result = await signIn("credentials", {
        email: String(formData.get("email") || "").trim().toLowerCase(),
        password: String(formData.get("password") || ""),
        redirect: false,
        callbackUrl: `${ADMIN_PANEL_PATH}/dashboard`
      });

      if (!result?.ok || result.error) {
        setError("Invalid credentials or authentication is not configured for this domain.");
        return;
      }

      const session = await getSession();
      if (session?.user?.role !== "ADMIN") {
        setError("This account does not have admin access.");
        return;
      }

      window.location.assign(result.url || `${ADMIN_PANEL_PATH}/dashboard`);
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
      </form>
    </div>
  );
}
