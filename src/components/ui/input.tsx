import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-11 w-full rounded-2xl bg-slate-50 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:shadow-[0_0_0_2px_rgba(13,22,51,0.2)]", className)} {...props} />;
}

