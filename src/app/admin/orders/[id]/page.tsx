import { notFound } from "next/navigation";

import { orderService } from "@/services/order.service";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await orderService.detail(params.id);
  if (!order) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm"><p><strong>Customer:</strong> {order.customerName}</p><p><strong>Phone:</strong> {order.phone}</p><p><strong>Address:</strong> {order.addressLine}, {order.city}, {order.state} - {order.pincode}</p></div>
      <div className="rounded-xl border border-slate-200 bg-white p-4"><h2 className="font-semibold">Items</h2><div className="mt-3 space-y-2 text-sm">{order.items.map((item) => <div key={item.id} className="flex justify-between"><span>{item.productName} x {item.quantity}</span><span>Rs. {Number(item.total).toFixed(0)}</span></div>)}</div></div>
    </div>
  );
}