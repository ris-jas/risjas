"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, UserRound } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Shop", icon: ShoppingBag },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/track-order", label: "Profile", icon: UserRound }
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 md:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-4 rounded-full border border-white/80 bg-white/95 p-2 shadow-[0_16px_40px_rgba(13,22,51,0.14)] backdrop-blur">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 rounded-full py-2 text-[11px] transition ${active ? "bg-rose-soft text-navy" : "text-slate-500"}`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

