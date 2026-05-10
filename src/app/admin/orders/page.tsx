import Link from "next/link";

import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { orderService } from "@/services/order.service";

export default async function AdminOrdersPage() {
  const orders = await orderService.listAdmin();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[58px] text-6xl font-bold">Orders Management</h1>
          <p className="mt-2 text-2xl text-zinc-600">Review and update customer orders efficiently.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-300 bg-zinc-100">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-300 text-sm uppercase tracking-wide text-zinc-600">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-zinc-300 last:border-b-0">
                <td className="p-4 text-2xl font-semibold">{order.orderNumber}</td>
                <td className="p-4">
                  <p className="text-xl font-medium">{order.customerName}</p>
                  <p className="text-zinc-600">{order.phone}</p>
                </td>
                <td className="p-4 text-2xl font-semibold">Rs. {Number(order.total).toFixed(0)}</td>
                <td className="p-4">
                  <div className="space-y-2">
                    <p className="inline-block rounded-full bg-zinc-200 px-3 py-1 text-sm">{order.paymentMethod}</p>
                    <p className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">{order.paymentStatus}</p>
                  </div>
                </td>
                <td className="p-4"><OrderStatusSelect id={order.id} value={order.status} type="status" /></td>
                <td className="p-4"><Link className="rounded-xl border border-zinc-400 px-4 py-2 font-medium hover:bg-zinc-200" href={`/admin/orders/${order.id}`}>View Details</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

