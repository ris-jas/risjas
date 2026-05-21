import Image from "next/image";
import Link from "next/link";

import ProductActions from "@/components/product/ProductActions";

export default function ProductCard({ product }: { product: any }) {
  const firstImage = product.images?.[0]?.imageUrl || "/products/cute-panda.png";
  const price = Number(product.price);

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-2.5 shadow-[0_4px_18px_rgba(15,47,102,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,47,102,0.12)]">
      <Link href={`/product/${product.slug}`} className="block rounded-[22px] bg-slate-50 p-3">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
        </div>
      </Link>

      <div className="space-y-3 px-2.5 pb-3.5 pt-4">
        <Link href={`/product/${product.slug}`} className="block line-clamp-2 text-sm font-semibold leading-snug text-navy transition-colors hover:text-rose-foreground sm:text-base">
          {product.name}
        </Link>
        <p className="text-xs text-slate-500">{product?.category?.name || "Trending pick"}</p>
        <p className="text-lg font-bold text-navy sm:text-xl">₹{price.toFixed(0)}</p>
        <ProductActions productId={product.id} variant="cardInline" />
      </div>
    </article>
  );
}
