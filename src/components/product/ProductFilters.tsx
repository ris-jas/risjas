"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductFilters({ categories }: { categories: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const apply = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="text-2xl font-semibold text-slate-900">Filters</h3>
      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Category</p>
        <select
          className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-navy"
          defaultValue={searchParams.get("category") || ""}
          onChange={(e) => apply("category", e.target.value)}
        >
          <option value="">All Products</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Search</p>
        <Input defaultValue={searchParams.get("search") || ""} placeholder="Search products..." className="mt-3" onBlur={(e) => apply("search", e.target.value)} />
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Price Range</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Input defaultValue={searchParams.get("minPrice") || ""} placeholder="Min" type="number" onBlur={(e) => apply("minPrice", e.target.value)} />
          <Input defaultValue={searchParams.get("maxPrice") || ""} placeholder="Max" type="number" onBlur={(e) => apply("maxPrice", e.target.value)} />
        </div>
      </div>

      <Button variant="outline" className="mt-5 w-full" onClick={() => router.push(pathname)}>
        Reset Filters
      </Button>
    </div>
  );
}

