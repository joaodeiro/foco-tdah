"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import type { TipoDocumento } from "@/lib/types";
import { agoraLocal } from "@/lib/format";
import { Button, Card, Field, Input, Select, Textarea } from "@/components/ui";

const MODELOS: Record<TipoDocumento, { titulo: string; modelo: string }> = {
  encaminhamento: {
    titulo: "Encaminhamento para internação",
    modelo:
      "Encaminho o paciente para internação e cuidados intensivos.\n\n" +
      "Motivo / quadro clínico:\n\n" +
      "Suspeita diagnóstica:\n\n" +
      "Medicações e procedimentos já realizados:\n\n" +
      "Solicito avaliação e condutas complementares a critério do médico veterinário responsável.",
  },
  atestado: {
    titulo: "Atestado veterinário",
    modelo:
      "Atesto, para os devidos fins, que o animal acima identificado foi examinado por mim nesta data, encontrando-se clinicamente saudável.",
  },
  outro: { titulo: "", modelo: "" },
};

export default function NovoDocumentoPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();

  const [tipo, setTipo] = useState<TipoDocumento>("encaminhamento");
  const [titulo, setTitulo] = useState(MODELOS.encaminhamento.titulo);
  const [data, setData] = useState(agoraLocal());
  const [conteudo, setConteudo] = useState(MODELOS.encaminhamento.modelo);
  const [salvando, setSalvando] = useState(false);

  function mudarTipo(novo: TipoDocumento) {
    setTipo(novo);
    setTitulo(MODELOS[novo].titulo);
    setConteudo(MODELOS[novo].modelo);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!conteudo.trim()) {
      toast.error("Escreva o conteúdo do documento.");
      return;
    }
    setSalvando(true);
    try {
      const { data: novo, error } = await supabase
        .from("documentos")
        .insert({
          animal_id: id,
          data: new Date(data).toISOString(),
          tipo,
          titulo: titulo.trim() || MODELOS[tipo].titulo || "Documento",
          conteudo,
        })
        .select("id")
        .single();

      if (error || !novo) {
        toast.error("Não foi possível salvar o documento.");
        return;
      }
      toast.success("Documento salvo! Abrindo para impressão.");
      router.push(`/documentos/${novo.id}`);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link href={`/pacientes/${id}`} className="mb-3 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700">
        <ArrowLeft className="size-4" /> Ficha do paciente
      </Link>
      <h1 className="mb-5 text-xl font-bold md:text-2xl">Novo documento</h1>

      <form onSubmit={salvar} className="space-y-5">
        <Card className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo">
              <Select value={tipo} onChange={(e) => mudarTipo(e.target.value as TipoDocumento)}>
                <option value="encaminhamento">Encaminhamento para internação</option>
                <option value="atestado">Atestado</option>
                <option value="outro">Outro documento</option>
              </Select>
            </Field>
            <Field label="Data">
              <Input type="datetime-local" value={data} onChange={(e) => setData(e.target.value)} required />
            </Field>
          </div>
          <Field label="Título do documento">
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Encaminhamento para internação" />
          </Field>
          <Field label="Conteúdo" hint="Esse texto sai no corpo do documento impresso, junto com os dados do paciente e do tutor.">
            <Textarea rows={10} value={conteudo} onChange={(e) => setConteudo(e.target.value)} />
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
