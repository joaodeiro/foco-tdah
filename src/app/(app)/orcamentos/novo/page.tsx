"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import type { Animal, OrcamentoItem, Servico } from "@/lib/types";
import { agoraLocal, brl, parseValor, totalOrcamento } from "@/lib/format";
import { Button, Card, Field, Input, Select, Spinner, Textarea } from "@/components/ui";

type Linha = { descricao: string; qtd: string; valor: string };

const linhaVazia: Linha = { descricao: "", qtd: "1", valor: "" };

function NovoOrcamentoForm() {
  const router = useRouter();
  const params = useSearchParams();
  const animalPrefixado = params.get("animal") ?? "";

  const [animais, setAnimais] = useState<Animal[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [animalId, setAnimalId] = useState(animalPrefixado);
  const [data, setData] = useState(agoraLocal());
  const [linhas, setLinhas] = useState<Linha[]>([{ ...linhaVazia }]);
  const [desconto, setDesconto] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    supabase
      .from("animais")
      .select("*, tutor:tutores(*)")
      .order("nome")
      .then(({ data }) => setAnimais((data as Animal[]) ?? []));
    supabase
      .from("servicos")
      .select("*")
      .order("nome")
      .then(({ data }) => setServicos((data as Servico[]) ?? []));
  }, []);

  function mudarLinha(indice: number, campo: keyof Linha, valor: string) {
    setLinhas((atual) => atual.map((l, i) => (i === indice ? { ...l, [campo]: valor } : l)));
  }

  function adicionarServico(servicoId: string) {
    const servico = servicos.find((s) => s.id === servicoId);
    if (!servico) return;
    const nova: Linha = {
      descricao: servico.nome,
      qtd: "1",
      valor: String(servico.valor).replace(".", ","),
    };
    setLinhas((atual) => {
      const ultima = atual[atual.length - 1];
      if (ultima && !ultima.descricao && !ultima.valor) {
        return [...atual.slice(0, -1), nova];
      }
      return [...atual, nova];
    });
  }

  const itens: OrcamentoItem[] = linhas
    .filter((l) => l.descricao.trim())
    .map((l) => ({ descricao: l.descricao.trim(), qtd: parseValor(l.qtd) || 1, valor: parseValor(l.valor) }));

  const total = totalOrcamento(itens, parseValor(desconto));

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item ao orçamento.");
      return;
    }
    setSalvando(true);
    try {
      const animal = animais.find((a) => a.id === animalId);
      const { data: novo, error } = await supabase
        .from("orcamentos")
        .insert({
          animal_id: animalId || null,
          tutor_id: animal?.tutor_id ?? null,
          data: new Date(data).toISOString(),
          itens,
          desconto: parseValor(desconto),
          observacoes,
        })
        .select("id")
        .single();

      if (error || !novo) {
        toast.error("Não foi possível salvar o orçamento.");
        return;
      }
      toast.success("Orçamento salvo! Abrindo para impressão.");
      router.push(`/orcamentos/${novo.id}`);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link href="/orcamentos" className="mb-3 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700">
        <ArrowLeft className="size-4" /> Orçamentos
      </Link>
      <h1 className="mb-5 text-xl font-bold md:text-2xl">Novo orçamento</h1>

      <form onSubmit={salvar} className="space-y-5">
        <Card className="grid gap-4 sm:grid-cols-2">
          <Field label="Paciente (opcional)">
            <Select value={animalId} onChange={(e) => setAnimalId(e.target.value)}>
              <option value="">Sem paciente vinculado</option>
              {animais.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome} {a.tutor ? `— ${a.tutor.nome}` : ""}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Data">
            <Input type="datetime-local" value={data} onChange={(e) => setData(e.target.value)} required />
          </Field>
        </Card>

        <Card className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-stone-800">Itens</h2>
            {servicos.length > 0 && (
              <Select
                className="w-auto"
                value=""
                onChange={(e) => {
                  if (e.target.value) adicionarServico(e.target.value);
                  e.target.value = "";
                }}
              >
                <option value="">＋ Adicionar da tabela de preços</option>
                {servicos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome} — {brl(s.valor)}
                  </option>
                ))}
              </Select>
            )}
          </div>

          {servicos.length === 0 && (
            <p className="rounded-lg bg-stone-50 px-3 py-2 text-xs text-stone-500">
              Dica: cadastre seus serviços em <Link href="/servicos" className="text-teal-700 underline">Preços</Link>{" "}
              para adicioná-los aqui com um clique, sem digitar valores toda vez.
            </p>
          )}

          <div className="space-y-2">
            {linhas.map((linha, i) => (
              <div key={i} className="flex flex-wrap items-end gap-2 sm:flex-nowrap">
                <Field label={i === 0 ? "Descrição" : ""} className="min-w-40 flex-1">
                  <Input
                    value={linha.descricao}
                    onChange={(e) => mudarLinha(i, "descricao", e.target.value)}
                    placeholder="Ex.: Fluidoterapia"
                  />
                </Field>
                <Field label={i === 0 ? "Qtd" : ""} className="w-16">
                  <Input value={linha.qtd} onChange={(e) => mudarLinha(i, "qtd", e.target.value)} inputMode="decimal" />
                </Field>
                <Field label={i === 0 ? "Valor unit. (R$)" : ""} className="w-28">
                  <Input
                    value={linha.valor}
                    onChange={(e) => mudarLinha(i, "valor", e.target.value)}
                    placeholder="0,00"
                    inputMode="decimal"
                  />
                </Field>
                <div className="w-24 pb-2 text-right text-sm font-medium text-stone-600">
                  {brl((parseValor(linha.qtd) || 1) * parseValor(linha.valor))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mb-0.5"
                  onClick={() => setLinhas(linhas.length > 1 ? linhas.filter((_, j) => j !== i) : [{ ...linhaVazia }])}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="button" variant="secondary" size="sm" onClick={() => setLinhas([...linhas, { ...linhaVazia }])}>
            <Plus className="size-4" /> Linha em branco
          </Button>

          <div className="flex items-center justify-between border-t border-stone-200 pt-3">
            <Field label="Desconto (R$)" className="w-32">
              <Input value={desconto} onChange={(e) => setDesconto(e.target.value)} placeholder="0,00" inputMode="decimal" />
            </Field>
            <div className="text-right">
              <p className="text-sm text-stone-500">Total</p>
              <p className="text-2xl font-bold text-teal-800">{brl(total)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <Field label="Observações">
            <Textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex.: Valores válidos por 7 dias. Não inclui exames laboratoriais."
            />
          </Field>
        </Card>

        <div className="flex justify-end gap-2">
          <Link href="/orcamentos" className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-stone-600 hover:bg-stone-200/60">
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

export default function NovoOrcamentoPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <NovoOrcamentoForm />
    </Suspense>
  );
}
