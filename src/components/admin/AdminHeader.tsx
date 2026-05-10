"use client";

import { Search } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/75 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="group relative flex w-full max-w-[620px] items-center overflow-hidden rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-soft transition-all duration-300 focus-within:border-navy focus-within:ring-2 focus-within:ring-red-100">
          <span className="pointer-events-none absolute -right-8 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-red-100/40 blur-xl" />
          <Search className="h-4 w-4 text-slate-400 transition-colors duration-300 group-focus-within:text-navy" />
          <input
            className="ml-2 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Search products..."
          />
        </div>
      </div>
    </header>
  );
}
