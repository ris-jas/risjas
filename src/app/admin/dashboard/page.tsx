import DashboardStats from "@/components/admin/DashboardStats";
import { orderService } from "@/services/order.service";

export default async function AdminDashboardPage() {
  const stats = await orderService.stats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[62px] text-6xl font-bold leading-none">Overview</h1>
          <p className="mt-2 text-2xl text-zinc-600">Today snapshot of your store performance.</p>
        </div>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid gap-5 xl:grid-cols-[1.6fr_0.8fr]">
        <div className="rounded-2xl border border-zinc-300 bg-zinc-100 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-4xl text-4xl font-semibold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-300 text-sm uppercase tracking-wide text-zinc-600">
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-zinc-300 last:border-b-0">
                    <td className="py-4 text-xl font-medium">{order.orderNumber}</td>
                    <td className="py-4 text-lg">{order.customerName}</td>
                    <td className="py-4 text-zinc-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 text-lg font-semibold">Rs. {Number(order.total).toFixed(0)}</td>
                    <td className="py-4"><span className="rounded-full bg-zinc-200 px-3 py-1 text-sm">{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="text-4xl text-4xl font-semibold text-red-700">Low Stock</h3>
            <p className="mt-2 text-red-700">{stats.lowStockProducts} products need inventory refill.</p>
          </div>

          <div className="rounded-2xl border border-zinc-300 bg-zinc-100 p-6">
            <h3 className="text-4xl text-4xl font-semibold">Top Sellers</h3>
            <div className="mt-4 space-y-3">
              {stats.bestSellingProducts.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-zinc-600">Stock {item.stock}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

