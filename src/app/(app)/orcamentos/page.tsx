"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Printer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { avisarErro } from "@/lib/errors";
import type { Orcamento } from "@/lib/types";
import { brl, fmtData, totalOrcamento } from "@/lib/format";
import { Button, Card, EmptyState, Spinner, btnCls } from "@/components/ui";

export default function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[] | null>(null);

  async function carregar() {
    const { data, error } = await supabase
      .from("orcamentos")
      .select("*, animal:animais(id, nome, especie, tutor:tutores(id, nome)), tutor:tutores(id, nome)")
      .order("data", { ascending: false });
    if (error) {
      avisarErro(error, "carregar os orçamentos");
      setOrcamentos([]);
      return;
    }
    setOrcamentos((data as unknown as Orcamento[]) ?? []);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function excluir(id: string) {
    if (!window.confirm("Excluir este orçamento? Essa ação não tem volta.")) return;
    const { error } = await supabase.from("orcamentos").delete().eq("id", id);
    if (error) {
      avisarErro(error, "excluir o orçamento");
      return;
    }
    toast.success("Excluído.");
    carregar();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold md:text-2xl">Orçamentos</h1>
        <Link href="/orcamentos/novo" className={btnCls("primary")}>
          <Plus className="size-4" />
          Novo orçamento
        </Link>
      </div>

      {orcamentos === null ? (
        <Spinner />
      ) : orcamentos.length === 0 ? (
        <EmptyState
          titulo="Nenhum orçamento ainda"
          descricao="Monte a lista de serviços com o valor de cada item e o total calculado — pronto para imprimir e deixar com o tutor."
        >
          <Link href="/orcamentos/novo" className={btnCls("primary")}>
            <Plus className="size-4" /> Criar orçamento
          </Link>
        </EmptyState>
      ) : (
        <div className="space-y-2">
          {orcamentos.map((o) => (
            <Card key={o.id} className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{brl(totalOrcamento(o.itens, o.desconto))}</p>
                <p className="text-sm text-stone-500">
                  {fmtData(o.data)}
                  {o.animal ? ` • ${o.animal.nome}` : ""}
                  {o.animal?.tutor ? ` (${o.animal.tutor.nome})` : o.tutor ? ` • ${o.tutor.nome}` : ""}
                  {" • "}
                  {o.itens.length} {o.itens.length === 1 ? "item" : "itens"}
                </p>
              </div>
              <div className="flex gap-1">
                <Link href={`/orcamentos/${o.id}`} className={btnCls("secondary", "sm")}>
                  <Printer className="size-3.5" /> Ver / imprimir
                </Link>
                <Button variant="ghost" size="sm" onClick={() => excluir(o.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
