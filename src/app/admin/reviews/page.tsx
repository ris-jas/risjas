"use client";

import { useEffect, useState } from "react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const load = () => fetch("/api/admin/reviews").then((r) => r.json()).then((d) => setReviews(d.data || []));

  useEffect(() => { load(); }, []);

  const update = async (id: string, isApproved: boolean) => {
    await fetch(`/api/admin/reviews/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isApproved }) });
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reviews</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-4">{reviews.map((review) => <div key={review.id} className="border-b border-slate-100 py-3 last:border-0"><p className="text-sm font-semibold">{review.name} - {review.product.name}</p><p className="text-xs text-slate-600">{review.comment}</p><div className="mt-2 flex gap-2 text-xs"><button className="rounded bg-green-100 px-2 py-1" onClick={() => update(review.id, true)}>Approve</button><button className="rounded bg-red-100 px-2 py-1" onClick={() => update(review.id, false)}>Reject</button></div></div>)}</div>
    </div>
  );
}