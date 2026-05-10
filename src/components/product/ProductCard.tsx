import Image from "next/image";
import Link from "next/link";

import ProductActions from "@/components/product/ProductActions";

export default function ProductCard({ product }: { product: any }) {
  const firstImage = product.images?.[0]?.imageUrl || "/products/cute-panda.png";
  const price = Number(product.price);

  return (
    <article className="group relative overflow-hidden rounded-[30px] bg-white p-2 transition duration-300 hover:-translate-y-1">
      <Link href={`/product/${product.slug}`} className="block rounded-[26px] bg-slate-50 p-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
          <ProductActions productId={product.id} variant="cardHover" />
        </div>
      </Link>

      <div className="space-y-2 px-2 pb-3 pt-4 sm:pt-5">
        <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm sm:text-lg leading-snug text-navy transition-colors hover:text-rose-foreground font-medium sm:font-normal">
          {product.name}
        </Link>
        <p className="text-base sm:text-xl font-bold text-navy">Rs. {price.toFixed(0)}</p>
      </div>
    </article>
  );
}
