"use client";

import { cn } from "@/lib/format";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 " +
  "disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const btnVariants = {
  primary: "bg-teal-700 text-white hover:bg-teal-800",
  secondary: "bg-white text-stone-800 border border-stone-300 hover:bg-stone-50",
  danger: "bg-white text-red-700 border border-red-200 hover:bg-red-50",
  ghost: "text-stone-600 hover:bg-stone-200/60",
} as const;

const btnSizes = {
  md: "h-10 px-4 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-11 px-5 text-base",
} as const;

export function btnCls(
  variant: keyof typeof btnVariants = "primary",
  size: keyof typeof btnSizes = "md",
  className = ""
) {
  return cn(btnBase, btnVariants[variant], btnSizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof btnVariants;
  size?: keyof typeof btnSizes;
}) {
  return <button className={btnCls(variant, size, className)} {...props} />;
}

const inputCls =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 " +
  "placeholder:text-stone-400 focus:outline-2 focus:outline-offset-0 focus:outline-teal-600";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputCls, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputCls, "min-h-20 leading-relaxed", className)} {...props} />;
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(inputCls, "h-9.5", className)} {...props} />;
}

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-sm font-medium text-stone-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-stone-200 bg-white p-4 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function Badge({
  tone = "teal",
  children,
}: {
  tone?: "teal" | "amber" | "red" | "stone";
  children: React.ReactNode;
}) {
  const tones = {
    teal: "bg-teal-50 text-teal-800 border-teal-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-red-50 text-red-800 border-red-200",
    stone: "bg-stone-100 text-stone-700 border-stone-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center">
      <p className="font-medium text-stone-700">{titulo}</p>
      {descricao && <p className="max-w-sm text-sm text-stone-500">{descricao}</p>}
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="size-7 animate-spin rounded-full border-2 border-stone-300 border-t-teal-700" />
    </div>
  );
}
