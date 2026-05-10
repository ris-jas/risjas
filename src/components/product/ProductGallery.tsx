"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export default function ProductGallery({ images, name }: { images: { imageUrl: string }[]; name: string }) {
  const galleryImages = useMemo(() => images?.length ? images : [{ imageUrl: "/placeholder.png" }], [images]);
  const [active, setActive] = useState(galleryImages[0].imageUrl);

  return (
    <div className="grid gap-4 sm:grid-cols-[82px_1fr]">
      <div className="order-2 grid grid-cols-3 gap-2 sm:order-1 sm:grid-cols-1">
        {galleryImages.map((image, idx) => (
          <button
            key={`${image.imageUrl}-${idx}`}
            type="button"
            onClick={() => setActive(image.imageUrl)}
            className={`relative aspect-square overflow-hidden rounded-2xl bg-slate-50/70 p-1.5 transition ${active === image.imageUrl ? "shadow-[0_0_0_2px_rgba(232,183,200,0.7)]" : "hover:shadow-[0_0_0_2px_rgba(13,22,51,0.2)]"}`}
          >
            <Image src={image.imageUrl} alt={name} fill className="rounded-xl object-cover" />
          </button>
        ))}
      </div>

      <div className="order-1 relative aspect-square overflow-hidden rounded-[34px] bg-slate-50/70 p-3 sm:order-2">
        <div className="relative h-full w-full overflow-hidden rounded-[28px]">
          <Image src={active} alt={name} fill className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-[34px] bg-gradient-to-t from-navy/8 to-transparent" />
      </div>
    </div>
  );
}

