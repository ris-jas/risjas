"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, LayoutGrid, Ticket, UserRound } from "lucide-react";

import { ADMIN_PANEL_PATH } from "@/lib/admin-path";

const links = [
  { href: `${ADMIN_PANEL_PATH}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
  { href: `${ADMIN_PANEL_PATH}/products`, label: "Products", icon: Package },
  { href: `${ADMIN_PANEL_PATH}/orders`, label: "Orders", icon: ShoppingBag },
  { href: `${ADMIN_PANEL_PATH}/categories`, label: "Categories", icon: LayoutGrid },
  { href: `${ADMIN_PANEL_PATH}/coupons`, label: "Coupons", icon: Ticket }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-[260px] flex-col overflow-hidden border-r border-slate-200/80 bg-white/90 p-5 backdrop-blur-xl lg:w-[280px]">
      <div className="pointer-events-none absolute -right-16 -top-10 h-36 w-36 rounded-full bg-red-100/70 blur-2xl" />
      <div className="pointer-events-none absolute -left-20 bottom-8 h-40 w-40 rounded-full bg-blue-100/70 blur-2xl" />

      <div className="relative rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-soft">
        <h2 className="text-3xl font-bold leading-tight text-navy">Risjas Admin</h2>
        <p className="mt-1 text-sm text-slate-500">Management Console</p>
      </div>

      <nav className="relative mt-5 space-y-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                active
                  ? "translate-x-0.5 bg-navy text-white shadow-soft"
                  : "text-slate-600 hover:translate-x-0.5 hover:bg-white hover:text-navy hover:shadow-soft"
              }`}
            >
              {active ? <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-red-300" /> : null}
              <Icon className={`h-[18px] w-[18px] transition-transform duration-300 ${active ? "" : "group-hover:scale-110"}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="relative mt-auto rounded-xl border border-slate-200/80 bg-white/85 p-3 shadow-soft">
        <Link
          href={`${ADMIN_PANEL_PATH}/profile`}
          className="group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-navy transition-all duration-300 hover:bg-red-soft/50"
        >
          <UserRound className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          Profile
        </Link>
      </div>
    </aside>
  );
}
