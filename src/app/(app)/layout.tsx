"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PawPrint, Calculator, Tags, Settings, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/format";

const itens = [
  { href: "/pacientes", label: "Pacientes", icone: PawPrint },
  { href: "/orcamentos", label: "Orçamentos", icone: Calculator },
  { href: "/servicos", label: "Preços", icone: Tags },
  { href: "/configuracoes", label: "Ajustes", icone: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh md:flex">
      {/* Barra lateral (telas grandes) */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-stone-200 bg-white md:flex print:hidden">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-teal-700 text-white">
            <PawPrint className="size-4.5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-teal-900">gestaovet</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {itens.map((item) => {
            const ativo = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  ativo ? "bg-teal-50 text-teal-800" : "text-stone-600 hover:bg-stone-100"
                )}
              >
                <item.icone className="size-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={sair}
          className="mx-3 mb-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100"
        >
          <LogOut className="size-4.5" />
          Sair
        </button>
      </aside>

      {/* Cabeçalho (celular) */}
      <header className="flex items-center gap-2 border-b border-stone-200 bg-white px-4 py-3 md:hidden print:hidden">
        <div className="flex size-7 items-center justify-center rounded-lg bg-teal-700 text-white">
          <PawPrint className="size-4" />
        </div>
        <span className="font-bold tracking-tight text-teal-900">gestaovet</span>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10 print:max-w-none print:p-0">
        {children}
      </main>

      {/* Navegação inferior (celular) */}
      <nav className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-4 border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden print:hidden">
        {itens.map((item) => {
          const ativo = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
                ativo ? "text-teal-700" : "text-stone-500"
              )}
            >
              <item.icone className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
