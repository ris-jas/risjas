import * as React from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-[120px] w-full rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:shadow-[0_0_0_2px_rgba(13,22,51,0.2)]", className)} {...props} />;
}

