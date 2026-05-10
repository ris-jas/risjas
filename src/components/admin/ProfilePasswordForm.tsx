"use client";

import { FormEvent, useState } from "react";

export default function ProfilePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!result.success) {
        setStatus({ type: "error", message: result.message || "Failed to update password" });
        setLoading(false);
        return;
      }

      setStatus({ type: "success", message: "Password updated successfully." });
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      setStatus({ type: "error", message: error.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Current Password</label>
        <input
          type="password"
          value={form.currentPassword}
          onChange={(event) => setForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-navy focus:bg-white focus:ring-2 focus:ring-navy/10"
          placeholder="Enter current password"
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">New Password</label>
        <input
          type="password"
          value={form.newPassword}
          onChange={(event) => setForm((prev) => ({ ...prev, newPassword: event.target.value }))}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-navy focus:bg-white focus:ring-2 focus:ring-navy/10"
          placeholder="Minimum 8 characters"
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Confirm New Password</label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-navy focus:bg-white focus:ring-2 focus:ring-navy/10"
          placeholder="Re-enter new password"
          required
        />
      </div>

      {status ? (
        <p className={`rounded-lg px-3 py-2 text-sm ${status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {status.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
