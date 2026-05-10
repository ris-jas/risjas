"use client";

import { useEffect, useState } from "react";

export default function AdminContactQueriesPage() {
  const [queries, setQueries] = useState<any[]>([]);
  const load = () => fetch("/api/admin/contact-queries").then((r) => r.json()).then((d) => setQueries(d.data || []));

  useEffect(() => { load(); }, []);

  const toggle = async (id: string, isResolved: boolean) => {
    await fetch(`/api/admin/contact-queries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isResolved }) });
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Contact Queries</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">{queries.map((query) => <div key={query.id} className="border-b border-slate-100 py-2 last:border-0"><p className="font-semibold">{query.name} ({query.phone})</p><p className="text-slate-600">{query.message}</p><button className="mt-2 rounded bg-slate-100 px-2 py-1 text-xs" onClick={() => toggle(query.id, !query.isResolved)}>Mark as {query.isResolved ? "Unresolved" : "Resolved"}</button></div>)}</div>
    </div>
  );
}