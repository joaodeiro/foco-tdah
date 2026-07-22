"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { avisarErro } from "@/lib/errors";
import type { ReceitaItem } from "@/lib/types";
import { agoraLocal } from "@/lib/format";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";

const itemVazio: ReceitaItem = { medicamento: "", quantidade: "", posologia: "" };

export default function NovaReceitaPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();

  const [tipo, setTipo] = useState<"simples" | "controlada">("simples");
  const [data, setData] = useState(agoraLocal());
  const [itens, setItens] = useState<ReceitaItem[]>([{ ...itemVazio }]);
  const [observacoes, setObservacoes] = useState("");
  const [salvando, setSalvando] = useState(false);

  function mudarItem(indice: number, campo: keyof ReceitaItem, valor: string) {
    setItens((atual) => atual.map((item, i) => (i === indice ? { ...item, [campo]: valor } : item)));
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const preenchidos = itens.filter((i) => i.medicamento.trim());
    if (preenchidos.length === 0) {
      toast.error("Receita sem medicamentos", {
        description: "Preencha pelo menos o nome do primeiro medicamento antes de salvar.",
      });
      return;
    }
    setSalvando(true);
    try {
      const { data: nova, error } = await supabase
        .from("receitas")
        .insert({
          animal_id: id,
          data: new Date(data).toISOString(),
          tipo,
          itens: preenchidos,
          observacoes,
        })
        .select("id")
        .single();

      if (error || !nova) {
        avisarErro(error, "salvar a receita");
        return;
      }
      toast.success("Receita salva! Abrindo para impressão.");
      router.push(`/receitas/${nova.id}`);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link href={`/pacientes/${id}`} className="mb-3 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700">
        <ArrowLeft className="size-4" /> Ficha do paciente
      </Link>
      <h1 className="mb-5 text-xl font-bold md:text-2xl">Nova receita</h1>

      <form onSubmit={salvar} className="space-y-5">
        <Card className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo de receita">
            <div className="grid grid-cols-2 gap-2">
              {(["simples", "controlada"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  className={
                    "rounded-lg border px-3 py-2 text-sm font-medium transition-colors " +
                    (tipo === t
                      ? "border-teal-600 bg-teal-50 text-teal-800"
                      : "border-stone-300 bg-white text-stone-600 hover:bg-stone-50")
                  }
                >
                  {t === "simples" ? "Simples" : "Controlada"}
                </button>
              ))}
            </div>
            {tipo === "controlada" && (
              <p className="mt-1 text-xs text-stone-500">
                Impressa em 2 vias (farmácia e paciente), no modelo de receituário de controle especial.
              </p>
            )}
          </Field>
          <Field label="Data">
            <Input type="datetime-local" value={data} onChange={(e) => setData(e.target.value)} required />
          </Field>
        </Card>

        <div className="space-y-3">
          {itens.map((item, i) => (
            <Card key={i} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-500">Medicamento {i + 1}</span>
                {itens.length > 1 && (
                  <Button variant="ghost" size="sm" type="button" onClick={() => setItens(itens.filter((_, j) => j !== i))}>
                    <Trash2 className="size-3.5" /> Remover
                  </Button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Medicamento e apresentação" className="sm:col-span-2">
                  <Input
                    value={item.medicamento}
                    onChange={(e) => mudarItem(i, "medicamento", e.target.value)}
                    placeholder="Ex.: Amoxicilina 250 mg/5 ml — suspensão oral"
                  />
                </Field>
                <Field label="Quantidade">
                  <Input
                    value={item.quantidade}
                    onChange={(e) => mudarItem(i, "quantidade", e.target.value)}
                    placeholder="Ex.: 1 frasco"
                  />
                </Field>
                <Field label="Posologia / modo de uso" className="sm:col-span-3">
                  <Textarea
                    rows={2}
                    value={item.posologia}
                    onChange={(e) => mudarItem(i, "posologia", e.target.value)}
                    placeholder="Ex.: Dar 5 ml, por via oral, a cada 12 horas, durante 7 dias."
                  />
                </Field>
              </div>
            </Card>
          ))}
          <Button type="button" variant="secondary" onClick={() => setItens([...itens, { ...itemVazio }])}>
            <Plus className="size-4" /> Adicionar medicamento
          </Button>
        </div>

        <Card>
          <Field label="Observações / orientações gerais">
            <Textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex.: Dar sempre após a alimentação. Retornar em 7 dias."
            />
          </Field>
        </Card>

        <div className="flex justify-end gap-2">
          <Link href={`/pacientes/${id}`} className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-stone-600 hover:bg-stone-200/60">
            Cancelar
          </Link>
          <Button type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar e imprimir"}
          </Button>
        </div>
      </form>
    </div>
  );
}
