"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Cat,
  Dog,
  FileText,
  Pencil,
  Phone,
  Pill,
  Plus,
  Printer,
  Stethoscope,
  Trash2,
  Calculator,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import type { Animal, Consulta, Documento, Orcamento, Receita } from "@/lib/types";
import {
  ESPECIE_LABEL,
  SEXO_LABEL,
  brl,
  cn,
  fmtData,
  fmtDataHora,
  idadeAnimal,
  totalOrcamento,
} from "@/lib/format";
import { Badge, Button, Card, EmptyState, Spinner, btnCls } from "@/components/ui";

type Aba = "consultas" | "receitas" | "documentos" | "orcamentos";

const TITULO_DOC: Record<string, string> = {
  encaminhamento: "Encaminhamento para internação",
  atestado: "Atestado",
  outro: "Documento",
};

export default function FichaPacientePage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState<Aba>("consultas");

  const carregar = useCallback(async () => {
    const [rAnimal, rConsultas, rReceitas, rDocumentos, rOrcamentos] = await Promise.all([
      supabase.from("animais").select("*, tutor:tutores(*)").eq("id", id).single(),
      supabase.from("consultas").select("*").eq("animal_id", id).order("data", { ascending: false }),
      supabase.from("receitas").select("*").eq("animal_id", id).order("data", { ascending: false }),
      supabase.from("documentos").select("*").eq("animal_id", id).order("data", { ascending: false }),
      supabase.from("orcamentos").select("*").eq("animal_id", id).order("data", { ascending: false }),
    ]);

    if (rAnimal.error || !rAnimal.data) {
      toast.error("Paciente não encontrado.");
      router.push("/pacientes");
      return;
    }
    setAnimal(rAnimal.data as Animal);
    setConsultas((rConsultas.data as Consulta[]) ?? []);
    setReceitas((rReceitas.data as Receita[]) ?? []);
    setDocumentos((rDocumentos.data as Documento[]) ?? []);
    setOrcamentos((rOrcamentos.data as Orcamento[]) ?? []);
    setCarregando(false);
  }, [id, router]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function excluir(tabela: string, itemId: string, nome: string) {
    if (!window.confirm(`Excluir ${nome}? Essa ação não tem volta.`)) return;
    const { error } = await supabase.from(tabela).delete().eq("id", itemId);
    if (error) {
      toast.error("Não foi possível excluir. Tente novamente.");
      return;
    }
    toast.success("Excluído.");
    carregar();
  }

  if (carregando || !animal) return <Spinner />;

  const Icone = animal.especie === "gato" ? Cat : Dog;
  const abas: { id: Aba; label: string; qtd: number }[] = [
    { id: "consultas", label: "Consultas", qtd: consultas.length },
    { id: "receitas", label: "Receitas", qtd: receitas.length },
    { id: "documentos", label: "Documentos", qtd: documentos.length },
    { id: "orcamentos", label: "Orçamentos", qtd: orcamentos.length },
  ];

  return (
    <div>
      <Link href="/pacientes" className="mb-3 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700">
        <ArrowLeft className="size-4" /> Pacientes
      </Link>

      {/* Cabeçalho do paciente */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-full",
                animal.especie === "gato" ? "bg-amber-100 text-amber-800" : "bg-teal-100 text-teal-800"
              )}
            >
              <Icone className="size-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold md:text-2xl">{animal.nome}</h1>
              <p className="text-sm text-stone-500">
                {[
                  ESPECIE_LABEL[animal.especie],
                  animal.raca,
                  SEXO_LABEL[animal.sexo],
                  idadeAnimal(animal),
                  animal.peso_kg ? `${String(animal.peso_kg).replace(".", ",")} kg` : "",
                  animal.castrado ? "castrado(a)" : "",
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            </div>
          </div>
          <Link href={`/pacientes/${animal.id}/editar`} className={btnCls("secondary", "sm")}>
            <Pencil className="size-3.5" /> Editar dados
          </Link>
        </div>

        {animal.tutor && (
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg bg-stone-50 px-3 py-2 text-sm">
            <span className="font-medium text-stone-700">Tutor: {animal.tutor.nome}</span>
            {animal.tutor.telefone && (
              <a href={`tel:${animal.tutor.telefone.replace(/\D/g, "")}`} className="inline-flex items-center gap-1 text-teal-700 hover:underline">
                <Phone className="size-3.5" /> {animal.tutor.telefone}
              </a>
            )}
            {animal.tutor.cpf && <span className="text-stone-500">CPF: {animal.tutor.cpf}</span>}
          </div>
        )}
        {animal.observacoes && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">{animal.observacoes}</p>
        )}
      </Card>

      {/* Ações rápidas */}
      <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-4">
        <Link href={`/pacientes/${animal.id}/consultas/nova`} className={btnCls("primary", "md", "w-full")}>
          <Stethoscope className="size-4" /> Nova consulta
        </Link>
        <Link href={`/pacientes/${animal.id}/receitas/nova`} className={btnCls("secondary", "md", "w-full")}>
          <Pill className="size-4" /> Nova receita
        </Link>
        <Link href={`/pacientes/${animal.id}/documentos/novo`} className={btnCls("secondary", "md", "w-full")}>
          <FileText className="size-4" /> Novo documento
        </Link>
        <Link href={`/orcamentos/novo?animal=${animal.id}`} className={btnCls("secondary", "md", "w-full")}>
          <Calculator className="size-4" /> Novo orçamento
        </Link>
      </div>

      {/* Abas */}
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg bg-stone-200/60 p-1">
        {abas.map((t) => (
          <button
            key={t.id}
            onClick={() => setAba(t.id)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              aba === t.id ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-800"
            )}
          >
            {t.label} {t.qtd > 0 && <span className="text-stone-400">({t.qtd})</span>}
          </button>
        ))}
      </div>

      {aba === "consultas" &&
        (consultas.length === 0 ? (
          <EmptyState titulo="Nenhuma consulta registrada" descricao="Registre a primeira consulta deste paciente.">
            <Link href={`/pacientes/${animal.id}/consultas/nova`} className={btnCls("primary", "sm")}>
              <Plus className="size-4" /> Nova consulta
            </Link>
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {consultas.map((c) => (
              <Card key={c.id}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{fmtDataHora(c.data)}</span>
                    <Badge tone={c.tipo === "retorno" ? "amber" : "teal"}>
                      {c.tipo === "retorno" ? "Retorno" : "Consulta"}
                    </Badge>
                    {c.peso_kg != null && (
                      <span className="text-sm text-stone-500">{String(c.peso_kg).replace(".", ",")} kg</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/consultas/${c.id}/editar`} className={btnCls("ghost", "sm")}>
                      <Pencil className="size-3.5" /> Editar
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => excluir("consultas", c.id, "esta consulta")}>
                      <Trash2 className="size-3.5" /> Excluir
                    </Button>
                  </div>
                </div>
                <dl className="space-y-2 text-sm">
                  {(
                    [
                      ["Queixa / anamnese", c.anamnese],
                      ["Exame físico", c.exame_fisico],
                      ["Diagnóstico", c.diagnostico],
                      ["Conduta / tratamento", c.tratamento],
                      ["Observações", c.observacoes],
                    ] as const
                  )
                    .filter(([, v]) => v)
                    .map(([rotulo, v]) => (
                      <div key={rotulo}>
                        <dt className="font-medium text-stone-500">{rotulo}</dt>
                        <dd className="whitespace-pre-wrap text-stone-800">{v}</dd>
                      </div>
                    ))}
                </dl>
              </Card>
            ))}
          </div>
        ))}

      {aba === "receitas" &&
        (receitas.length === 0 ? (
          <EmptyState titulo="Nenhuma receita ainda" descricao="Crie uma receita e imprima na hora.">
            <Link href={`/pacientes/${animal.id}/receitas/nova`} className={btnCls("primary", "sm")}>
              <Plus className="size-4" /> Nova receita
            </Link>
          </EmptyState>
        ) : (
          <div className="space-y-2">
            {receitas.map((r) => (
              <Card key={r.id} className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{fmtData(r.data)}</span>
                    {r.tipo === "controlada" && <Badge tone="red">Controlada — 2 vias</Badge>}
                  </div>
                  <p className="mt-0.5 max-w-md truncate text-sm text-stone-500">
                    {r.itens.map((i) => i.medicamento).filter(Boolean).join(", ") || "Sem itens"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Link href={`/receitas/${r.id}`} className={btnCls("secondary", "sm")}>
                    <Printer className="size-3.5" /> Ver / imprimir
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => excluir("receitas", r.id, "esta receita")}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ))}

      {aba === "documentos" &&
        (documentos.length === 0 ? (
          <EmptyState
            titulo="Nenhum documento ainda"
            descricao="Encaminhamentos de internação e outros documentos ficam guardados aqui."
          >
            <Link href={`/pacientes/${animal.id}/documentos/novo`} className={btnCls("primary", "sm")}>
              <Plus className="size-4" /> Novo documento
            </Link>
          </EmptyState>
        ) : (
          <div className="space-y-2">
            {documentos.map((d) => (
              <Card key={d.id} className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-semibold">{d.titulo || TITULO_DOC[d.tipo]}</span>
                  <p className="text-sm text-stone-500">{fmtData(d.data)}</p>
                </div>
                <div className="flex gap-1">
                  <Link href={`/documentos/${d.id}`} className={btnCls("secondary", "sm")}>
                    <Printer className="size-3.5" /> Ver / imprimir
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => excluir("documentos", d.id, "este documento")}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ))}

      {aba === "orcamentos" &&
        (orcamentos.length === 0 ? (
          <EmptyState titulo="Nenhum orçamento ainda" descricao="Monte um orçamento com os valores de cada item.">
            <Link href={`/orcamentos/novo?animal=${animal.id}`} className={btnCls("primary", "sm")}>
              <Plus className="size-4" /> Novo orçamento
            </Link>
          </EmptyState>
        ) : (
          <div className="space-y-2">
            {orcamentos.map((o) => (
              <Card key={o.id} className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-semibold">{brl(totalOrcamento(o.itens, o.desconto))}</span>
                  <p className="text-sm text-stone-500">
                    {fmtData(o.data)} • {o.itens.length} {o.itens.length === 1 ? "item" : "itens"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Link href={`/orcamentos/${o.id}`} className={btnCls("secondary", "sm")}>
                    <Printer className="size-3.5" /> Ver / imprimir
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => excluir("orcamentos", o.id, "este orçamento")}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ))}
    </div>
  );
}
