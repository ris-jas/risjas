export default function DashboardStats({ stats }: { stats: any }) {
  const cards = [
    ["Total Revenue", `Rs. ${Number(stats.totalRevenue || 0).toFixed(0)}`, "+12.5% from last month"],
    ["Total Orders", stats.totalOrders || 0, "+5.2% from last month"],
    ["Pending Orders", stats.pendingOrders || 0, "Requires fulfillment"],
    ["Delivered", stats.deliveredOrders || 0, "Completed this month"]
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, hint]) => (
        <div key={String(label)} className="rounded-2xl border border-zinc-300 bg-zinc-100 p-5">
          <p className="text-sm uppercase tracking-wide text-zinc-600">{label}</p>
          <p className="mt-2 text-[44px] text-5xl font-semibold leading-none">{value}</p>
          <p className="mt-2 text-sm text-zinc-600">{hint}</p>
        </div>
      ))}
    </div>
  );
}

