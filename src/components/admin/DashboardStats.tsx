export default function DashboardStats({ stats }: { stats: any }) {
  const cards = [
    ["Total Revenue", `Rs. ${Number(stats.totalRevenue || 0).toFixed(0)}`, "Gross sales collected"],
    ["Total Orders", stats.totalOrders || 0, "Orders placed so far"],
    ["Pending Orders", stats.pendingOrders || 0, "Needs fulfillment"],
    ["Delivered", stats.deliveredOrders || 0, "Successfully delivered"]
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, hint], index) => (
        <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className={`mt-2 text-4xl font-bold leading-none ${index === 2 && Number(stats.pendingOrders || 0) > 0 ? "text-red-deep" : "text-navy"}`}>{value}</p>
          <p className="mt-2 text-sm text-slate-500">{hint}</p>
        </div>
      ))}
    </div>
  );
}
