"use client";

import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";

import Reveal from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = { name: form.get("name"), email: form.get("email"), phone: form.get("phone"), message: form.get("message") };
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json();
    setStatus(result.success ? "Message sent successfully." : result.message);
  };

  return (
    <div className="container-page section-space">
      <Reveal className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-navy/75">Contact RISJAS</p>
        <h1 className="mt-3 text-4xl font-bold text-navy sm:text-5xl">We Are Here To Help</h1>
        <p className="mt-3 text-base font-light text-slate-500">Quick support for orders, returns, and product queries.</p>
      </Reveal>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <form onSubmit={onSubmit} className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-navy">Send A Message</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Input name="name" placeholder="Name" required />
              <Input name="email" placeholder="Email" />
              <Input name="phone" placeholder="Phone" required className="sm:col-span-2" />
              <Textarea name="message" placeholder="How can we help?" required className="sm:col-span-2" />
            </div>
            <Button type="submit" className="mt-5">Send Message</Button>
            {status ? <p className="mt-3 text-sm text-slate-600">{status}</p> : null}
          </form>
        </Reveal>

        <Reveal className="space-y-4" delay={0.05}>
          <div className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-bold text-navy">Contact Information</h3>
            <div className="mt-5 space-y-4 text-slate-600">
              <p className="flex items-start gap-3"><Mail className="mt-1 h-5 w-5 text-rose" /><span><strong className="text-slate-800">Email</strong><br />support@risjas.com</span></p>
              <p className="flex items-start gap-3"><Phone className="mt-1 h-5 w-5 text-rose" /><span><strong className="text-slate-800">Phone</strong><br />+91 80000 00000</span></p>
              <p className="flex items-start gap-3"><Clock className="mt-1 h-5 w-5 text-rose" /><span><strong className="text-slate-800">Hours</strong><br />Mon - Sat, 9 AM to 7 PM</span></p>
            </div>
          </div>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999"}`}
            target="_blank"
            className="flex items-center justify-between rounded-[30px] border border-rose bg-rose-soft px-6 py-5 transition hover:shadow-[0_0_0_6px_rgba(231,167,185,0.2)]"
          >
            <div>
              <p className="text-sm font-semibold text-navy/70">Instant Support</p>
              <p className="text-xl font-bold text-navy">Chat On WhatsApp</p>
            </div>
            <MessageCircle className="h-6 w-6 text-rose-foreground" />
          </a>
        </Reveal>
      </div>
    </div>
  );
}
