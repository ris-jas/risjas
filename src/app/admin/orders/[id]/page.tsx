import Link from "next/link";
import { ArrowLeft, MapPin, Package, Phone, ReceiptText } from "lucide-react";

import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { ADMIN_PANEL_PATH } from "@/lib/admin-path";
import { orderService } from "@/services/order.service";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await orderService.detail(params.id);
  if (!order) return <p className="rounded-xl bg-white p-6 text-slate-600">Order not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={`${ADMIN_PANEL_PATH}/orders`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-navy"><ArrowLeft className="h-4 w-4" /> Back to orders</Link>
          <h1 className="mt-3 text-3xl font-bold text-navy">Order {order.orderNumber}</h1>
          <p className="mt-1 text-sm text-slate-500">Placed on {new Date(order.createdAt).toLocaleString("en-IN")}</p>
        </div>
        <OrderStatusSelect id={order.id} value={order.status} type="status" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4"><Package className="h-5 w-5 text-red" /><h2 className="text-xl font-bold text-navy">Items in this order</h2></div>
          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 py-5">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100"><img src={item.product?.images?.[0]?.imageUrl || "/products/cute-panda.png"} alt={item.productName} className="h-full w-full object-cover" /></div>
                <div className="min-w-0 flex-1"><p className="font-semibold text-navy">{item.productName}</p><p className="mt-1 text-sm text-slate-500">SKU: {item.productSku}</p><p className="mt-2 text-sm text-slate-600">Rs. {Number(item.price).toFixed(0)} × {item.quantity}</p></div>
                <p className="font-bold text-navy">Rs. {Number(item.total).toFixed(0)}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-4 text-sm"><div className="flex justify-between text-slate-600"><span>Subtotal</span><span>Rs. {Number(order.subtotal).toFixed(0)}</span></div><div className="flex justify-between text-slate-600"><span>Shipping</span><span>Rs. {Number(order.shippingCharge).toFixed(0)}</span></div><div className="flex justify-between pt-2 text-base font-bold text-navy"><span>Total</span><span>Rs. {Number(order.total).toFixed(0)}</span></div></div>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><h2 className="flex items-center gap-2 text-xl font-bold text-navy"><MapPin className="h-5 w-5 text-red" /> Delivery details</h2><div className="mt-4 space-y-2 text-sm text-slate-600"><p className="font-semibold text-navy">{order.customerName}</p><p>{order.addressLine}</p><p>{order.city}, {order.state} - {order.pincode}</p><p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {order.phone}</p>{order.email ? <p>{order.email}</p> : null}</div></section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><h2 className="flex items-center gap-2 text-xl font-bold text-navy"><ReceiptText className="h-5 w-5 text-red" /> Payment</h2><div className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><span className="text-slate-500">Method</span><span className="font-semibold text-navy">{order.paymentMethod}</span></div><div className="flex items-center justify-between"><span className="text-slate-500">Status</span><OrderStatusSelect id={order.id} value={order.paymentStatus} type="payment-status" /></div></div></section>
        </div>
      </div>
    </div>
  );
}
