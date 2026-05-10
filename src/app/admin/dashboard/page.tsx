import { AlertTriangle, CheckCircle2 } from "lucide-react";

import DashboardStats from "@/components/admin/DashboardStats";
import { orderService } from "@/services/order.service";

export default async function AdminDashboardPage() {
  const stats = await orderService.stats();
  const hasLowStock = Number(stats.lowStockProducts || 0) > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-7">
        <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">Store Overview</h1>
        <p className="mt-2 text-base text-slate-600 sm:text-lg">Today&apos;s snapshot of your store performance and fulfillment health.</p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-navy">Recent Orders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <th className="py-3 font-semibold">Order ID</th>
                  <th className="py-3 font-semibold">Customer</th>
                  <th className="py-3 font-semibold">Date</th>
                  <th className="py-3 font-semibold">Total</th>
                  <th className="py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length ? (
                  stats.recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-slate-100 last:border-b-0">
                      <td className="py-4 text-sm font-semibold text-navy">{order.orderNumber}</td>
                      <td className="py-4 text-sm text-slate-700">{order.customerName}</td>
                      <td className="py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 text-sm font-semibold text-navy">Rs. {Number(order.total).toFixed(0)}</td>
                      <td className="py-4">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-slate-500">
                      No recent orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-5">
          <div className={`rounded-2xl p-6 shadow-soft ${hasLowStock ? "border border-red-200 bg-red-soft" : "border border-emerald-200 bg-emerald-50"}`}>
            <div className="flex items-center gap-2">
              {hasLowStock ? <AlertTriangle className="h-5 w-5 text-red-deep" /> : <CheckCircle2 className="h-5 w-5 text-emerald-700" />}
              <h3 className={`text-2xl font-bold ${hasLowStock ? "text-red-deep" : "text-emerald-700"}`}>{hasLowStock ? "Low Stock" : "Inventory Healthy"}</h3>
            </div>
            <p className={`mt-2 text-sm ${hasLowStock ? "text-red-deep" : "text-emerald-700"}`}>
              {hasLowStock ? `${stats.lowStockProducts} products need inventory refill.` : "All active products are above low-stock threshold."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-2xl font-bold text-navy">Top Sellers</h3>
            <div className="mt-4 space-y-2.5">
              {stats.bestSellingProducts.length ? (
                stats.bestSellingProducts.map((item: any, index: number) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy/10 text-xs font-semibold text-navy">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sold {item.soldQty || 0}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No order data yet. Top sellers will appear automatically after sales.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
