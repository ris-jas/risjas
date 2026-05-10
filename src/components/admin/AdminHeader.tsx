"use client";

import { Search } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminHeader() {
  return (
    <div className="flex items-center justify-between border-b border-zinc-300 bg-[#efefef] px-8 py-4">
      <div className="flex w-full max-w-[560px] items-center rounded-full border border-zinc-300 bg-zinc-100 px-4 py-2.5">
        <Search className="h-4 w-4 text-zinc-500" />
        <input className="ml-2 w-full bg-transparent text-sm outline-none" placeholder="Search products..." />
      </div>
      <button className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white" onClick={() => signOut({ callbackUrl: "/admin" })}>
        Logout
      </button>
    </div>
  );
}

