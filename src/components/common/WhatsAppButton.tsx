"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
  const url = `https://wa.me/${number}`;

  return (
    <Link
      href={url}
      target="_blank"
      className="fixed bottom-24 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-navy shadow-soft transition hover:-translate-y-0.5 md:bottom-5"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </Link>
  );
}

