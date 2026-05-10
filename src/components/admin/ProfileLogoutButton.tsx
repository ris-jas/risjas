"use client";

import { signOut } from "next-auth/react";

import { ADMIN_PANEL_PATH } from "@/lib/admin-path";

export default function ProfileLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: ADMIN_PANEL_PATH })}
      className="rounded-xl border border-red-200 bg-red-soft px-4 py-2 text-sm font-semibold text-red-deep transition hover:bg-red-100"
    >
      Logout
    </button>
  );
}
