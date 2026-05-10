import Link from "next/link";
import { FileText, RotateCcw, Shield, Truck } from "lucide-react";

const links = [
  { href: "/privacy-policy", label: "Privacy Policy", icon: Shield },
  { href: "/shipping-policy", label: "Shipping Policy", icon: Truck },
  { href: "/return-refund-policy", label: "Return & Refund", icon: RotateCcw },
  { href: "/terms-conditions", label: "Terms & Conditions", icon: FileText }
];

export default function PolicyTemplate({
  title,
  updatedAt,
  children,
  activeHref
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
  activeHref: string;
}) {
  return (
    <div className="container-page section-space">
      <div className="grid gap-5 lg:grid-cols-[250px_1fr]">
        <aside className="h-fit rounded-[28px] border border-slate-100 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-bold text-navy">Policies</h3>
          <div className="mt-4 space-y-2">
            {links.map((item) => {
              const Icon = item.icon;
              const active = activeHref === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${active ? "bg-navy text-white" : "text-slate-600 hover:bg-rose-soft hover:text-navy"}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </aside>

        <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6 h-36 rounded-2xl bg-[radial-gradient(circle_at_22%_22%,rgba(231,167,185,0.28),transparent_42%),linear-gradient(135deg,#f8fafc,#eef2ff)]" />
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm font-light text-slate-500">Last updated: {updatedAt}</p>
          <div className="prose mt-6 max-w-none prose-slate prose-headings:text-slate-800 prose-headings:font-semibold prose-p:text-slate-600 prose-li:text-slate-600">{children}</div>
        </div>
      </div>
    </div>
  );
}
