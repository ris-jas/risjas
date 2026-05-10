"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, ShoppingBag, LayoutGrid, Ticket } from "lucide-react";

const links = [
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-[300px] flex-col border-r border-zinc-300 bg-[#ededed] p-6">
      <div>
        <h2 className="text-[48px] text-5xl font-bold leading-none">Admin Dashboard</h2>
        <p className="mt-2 text-xl text-zinc-600">Risjas Management</p>
      </div>

      <nav className="mt-10 space-y-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-4 py-4 text-2xl text-xl font-medium transition ${active ? "bg-black text-white" : "text-zinc-700 hover:bg-zinc-200"}`}>
              <Icon className="h-6 w-6" />
              {label}
            </Link>
          );
        })}
      </nav>

      <Link href="/admin/products/new" className="mt-auto rounded-2xl bg-black px-4 py-4 text-center text-xl font-semibold text-white">+ Add New Product</Link>

      <div className="mt-4 rounded-2xl border border-zinc-300 bg-zinc-100 p-3 text-zinc-700">
        <p className="font-semibold">Admin Profile</p>
        <p className="text-sm">Risjas Management</p>
      </div>
    </aside>
  );
}

