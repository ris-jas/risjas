export default function Loading({ text = "Loading..." }: { text?: string }) {
  return <div className="py-8 text-center text-sm text-slate-500">{text}</div>;
}