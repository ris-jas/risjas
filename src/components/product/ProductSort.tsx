"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ProductSort({ defaultValue = "newest" }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select defaultValue={defaultValue} className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none transition focus:border-navy" onChange={(e) => onChange(e.target.value)}>
      <option value="newest">Sort by: Newest</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
}

