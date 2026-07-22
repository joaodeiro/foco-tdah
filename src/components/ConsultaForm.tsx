"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import type { Consulta } from "@/lib/types";
import { agoraLocal, isoParaInputLocal, parseValor } from "@/lib/format";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";

export function ConsultaForm({ animalId, consulta }: { animalId: string; consulta?: Consulta }) {
  const router = useRouter();
  const [data, setData] = useState(consulta ? isoParaInputLocal(consulta.data) : agoraLocal());
  const [tipo, setTipo] = useState<"consulta" | "retorno">(consulta?.tipo ?? "consulta");
  const [peso, setPeso] = useState(
    consulta?.peso_kg != null ? String(consulta.peso_kg).replace(".", ",") : ""
  );
  const [anamnese, setAnamnese] = useState(consulta?.anamnese ?? "");
  const [exame, setExame] = useState(consulta?.exame_fisico ?? "");
  const [diagnostico, setDiagnostico] = useState(consulta?.diagnostico ?? "");
  const [tratamento, setTratamento] = useState(consulta?.tratamento ?? "");
  const [observacoes, setObservacoes] = useState(consulta?.observacoes ?? "");
  const [salvando, setSalvando] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      const registro = {
        animal_id: animalId,
        data: new Date(data).toISOString(),
        tipo,
        peso_kg: peso ? parseValor(peso) : null,
        anamnese,
        exame_fisico: exame,
        diagnostico,
        tratamento,
        observacoes,
      };

      const { error } = consulta
        ? await supabase.from("consultas").update(registro).eq("id", consulta.id)
        : await supabase.from("consultas").insert(registro);

      if (error) {
        toast.error("Não foi possível salvar a consulta.");
        return;
      }
      toast.success(consulta ? "Consulta atualizada!" : "Consulta registrada!");
      router.push(`/pacientes/${animalId}`);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={salvar} className="space-y-5">
      <Card className="grid gap-4 sm:grid-cols-3">
        <Field label="Data e hora">
          <Input type="datetime-local" value={data} onChange={(e) => setData(e.target.value)} required />
        </Field>
        <Field label="Tipo">
          <div className="grid grid-cols-2 gap-2">
            {(["consulta", "retorno"] as const).map((t) => (
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
                {t === "consulta" ? "Consulta" : "Retorno"}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Peso (kg)">
          <Input value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="Ex.: 8,5" inputMode="decimal" />
        </Field>
      </Card>

      <Card className="space-y-4">
        <Field label="Queixa / anamnese">
          <Textarea rows={3} value={anamnese} onChange={(e) => setAnamnese(e.target.value)} placeholder="O que o tutor relatou, histórico do problema..." />
        </Field>
        <Field label="Exame físico">
          <Textarea rows={3} value={exame} onChange={(e) => setExame(e.target.value)} placeholder="Temperatura, mucosas, ausculta, TPC, hidratação..." />
        </Field>
        <Field label="Diagnóstico / suspeita">
          <Textarea rows={2} value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} />
        </Field>
        <Field label="Conduta / tratamento">
          <Textarea rows={3} value={tratamento} onChange={(e) => setTratamento(e.target.value)} placeholder="Medicações aplicadas, procedimentos, orientações..." />
        </Field>
        <Field label="Observações">
          <Textarea rows={2} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
        </Field>
      </Card>

      <div className="flex justify-end gap-2">
        <Link href={`/pacientes/${animalId}`} className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-stone-600 hover:bg-stone-200/60">
          Cancelar
        </Link>
        <Button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar consulta"}
        </Button>
      </div>
    </form>
  );
}
