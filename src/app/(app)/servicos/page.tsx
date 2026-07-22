"use client";

import { useEffect, useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import type { Servico } from "@/lib/types";
import { brl, parseValor } from "@/lib/format";
import { Button, Card, EmptyState, Input, Spinner } from "@/components/ui";

const EXEMPLOS = [
  "Consulta domiciliar",
  "Retorno",
  "Fluidoterapia",
  "Medicação injetável (por aplicação)",
  "Coleta de sangue para exame",
  "Vacina polivalente (V8/V10)",
  "Vacina antirrábica",
  "Curativo",
  "Aferição de glicemia",
  "Eutanásia assistida",
];

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[] | null>(null);
  const [novoNome, setNovoNome] = useState("");
  const [novoValor, setNovoValor] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editValor, setEditValor] = useState("");

  async function carregar() {
    const { data, error } = await supabase.from("servicos").select("*").order("nome");
    if (error) {
      toast.error("Não foi possível carregar os serviços.");
      setServicos([]);
      return;
    }
    setServicos((data as Servico[]) ?? []);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!novoNome.trim()) return;
    const { error } = await supabase
      .from("servicos")
      .insert({ nome: novoNome.trim(), valor: parseValor(novoValor) });
    if (error) {
      toast.error("Não foi possível adicionar o serviço.");
      return;
    }
    toast.success("Serviço adicionado!");
    setNovoNome("");
    setNovoValor("");
    carregar();
  }

  async function adicionarExemplos() {
    const { error } = await supabase
      .from("servicos")
      .insert(EXEMPLOS.map((nome) => ({ nome, valor: 0 })));
    if (error) {
      toast.error("Não foi possível adicionar os exemplos.");
      return;
    }
    toast.success("Lista criada! Agora é só ajustar os valores.");
    carregar();
  }

  async function salvarEdicao(id: string) {
    const { error } = await supabase
      .from("servicos")
      .update({ nome: editNome.trim(), valor: parseValor(editValor) })
      .eq("id", id);
    if (error) {
      toast.error("Não foi possível salvar a alteração.");
      return;
    }
    toast.success("Serviço atualizado!");
    setEditandoId(null);
    carregar();
  }

  async function excluir(id: string) {
    if (!window.confirm("Excluir este serviço da tabela de preços?")) return;
    const { error } = await supabase.from("servicos").delete().eq("id", id);
    if (error) {
      toast.error("Não foi possível excluir. Tente novamente.");
      return;
    }
    toast.success("Excluído.");
    carregar();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-xl font-bold md:text-2xl">Serviços e preços</h1>
      <p className="mb-5 text-sm text-stone-500">
        Sua tabela de valores. Esses serviços aparecem com um clique na hora de montar um orçamento.
      </p>

      <Card className="mb-4">
        <form onSubmit={adicionar} className="flex flex-wrap items-end gap-2 sm:flex-nowrap">
          <div className="min-w-40 flex-1">
            <Input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Nome do serviço" />
          </div>
          <div className="w-32">
            <Input value={novoValor} onChange={(e) => setNovoValor(e.target.value)} placeholder="Valor (R$)" inputMode="decimal" />
          </div>
          <Button type="submit">
            <Plus className="size-4" /> Adicionar
          </Button>
        </form>
      </Card>

      {servicos === null ? (
        <Spinner />
      ) : servicos.length === 0 ? (
        <EmptyState
          titulo="Nenhum serviço cadastrado"
          descricao="Adicione seus serviços acima, ou comece com uma lista pronta dos mais comuns e ajuste os valores."
        >
          <Button variant="secondary" onClick={adicionarExemplos}>
            Criar lista com serviços comuns
          </Button>
        </EmptyState>
      ) : (
        <Card className="divide-y divide-stone-100 p-0">
          {servicos.map((s) => (
            <div key={s.id} className="flex items-center gap-2 px-4 py-2.5">
              {editandoId === s.id ? (
                <>
                  <Input className="flex-1" value={editNome} onChange={(e) => setEditNome(e.target.value)} />
                  <Input
                    className="w-28"
                    value={editValor}
                    onChange={(e) => setEditValor(e.target.value)}
                    inputMode="decimal"
                  />
                  <Button size="sm" onClick={() => salvarEdicao(s.id)}>
                    <Check className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditandoId(null)}>
                    <X className="size-3.5" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium text-stone-800">{s.nome}</span>
                  <span className="w-24 text-right text-sm font-semibold text-teal-800">{brl(s.valor)}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditandoId(s.id);
                      setEditNome(s.nome);
                      setEditValor(String(s.valor).replace(".", ","));
                    }}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => excluir(s.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
