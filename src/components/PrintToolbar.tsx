"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui";

export function PrintToolbar({ voltarPara, aviso }: { voltarPara: string; aviso?: string }) {
  return (
    <div className="sticky top-0 z-10 border-b border-stone-300 bg-stone-100/95 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-[210mm] items-center justify-between gap-3 px-4 py-3">
        <Link href={voltarPara} className="inline-flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900">
          <ArrowLeft className="size-4" /> Voltar
        </Link>
        <Button onClick={() => window.print()}>
          <Printer className="size-4" /> Imprimir
        </Button>
      </div>
      {aviso && (
        <p className="mx-auto max-w-[210mm] px-4 pb-2 text-xs text-amber-700">{aviso}</p>
      )}
    </div>
  );
}
