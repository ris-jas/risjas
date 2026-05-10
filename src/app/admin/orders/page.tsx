import Link from "next/link";

import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { ADMIN_PANEL_PATH } from "@/lib/admin-path";
import { orderService } from "@/services/order.service";

export default async function AdminOrdersPage() {
  const orders = await orderService.listAdmin();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-7">
        <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">Orders Management</h1>
        <p className="mt-2 text-base text-slate-600 sm:text-lg">Track customer orders, payments, and fulfillment status in real-time.</p>
        <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
          Total Orders: {orders.length}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-3.5 text-sm font-semibold text-navy">{order.orderNumber}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-slate-700">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.phone}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-navy">Rs. {Number(order.total).toFixed(0)}</td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-1.5">
                      <p className="inline-block rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        {order.paymentMethod}
                      </p>
                      <p className="inline-block rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                        {order.paymentStatus}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <OrderStatusSelect id={order.id} value={order.status} type="status" />
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      className="inline-flex rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-navy transition-all duration-300 hover:bg-red-soft/50"
                      href={`${ADMIN_PANEL_PATH}/orders/${order.id}`}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
