"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Cat, Dog, Plus, Search } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { avisarErro } from "@/lib/errors";
import type { Animal } from "@/lib/types";
import { ESPECIE_LABEL, SEXO_LABEL, cn, idadeAnimal } from "@/lib/format";
import { EmptyState, Input, Spinner, btnCls } from "@/components/ui";

export default function PacientesPage() {
  const [animais, setAnimais] = useState<Animal[] | null>(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    supabase
      .from("animais")
      .select("*, tutor:tutores(*)")
      .order("nome")
      .then(({ data, error }) => {
        if (error) {
          avisarErro(error, "carregar os pacientes");
          setAnimais([]);
          return;
        }
        setAnimais((data as Animal[]) ?? []);
      });
  }, []);

  const filtrados = useMemo(() => {
    if (!animais) return [];
    const termo = busca.trim().toLowerCase();
    if (!termo) return animais;
    return animais.filter(
      (a) =>
        a.nome.toLowerCase().includes(termo) ||
        a.raca.toLowerCase().includes(termo) ||
        (a.tutor?.nome ?? "").toLowerCase().includes(termo)
    );
  }, [animais, busca]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-stone-900 md:text-2xl">Pacientes</h1>
        <Link href="/pacientes/novo" className={btnCls("primary")}>
          <Plus className="size-4" />
          Novo cadastro
        </Link>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
        <Input
          className="pl-9"
          placeholder="Buscar por animal, tutor ou raça..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {animais === null ? (
        <Spinner />
      ) : animais.length === 0 ? (
        <EmptyState
          titulo="Nenhum paciente cadastrado ainda"
          descricao="Comece cadastrando o tutor e o animal. Depois é só clicar no paciente para registrar consultas, receitas e orçamentos."
        >
          <Link href="/pacientes/novo" className={btnCls("primary")}>
            <Plus className="size-4" />
            Cadastrar primeiro paciente
          </Link>
        </EmptyState>
      ) : filtrados.length === 0 ? (
        <EmptyState titulo={`Nada encontrado para “${busca}”`} />
      ) : (
        <ul className="space-y-2">
          {filtrados.map((a) => {
            const Icone = a.especie === "gato" ? Cat : Dog;
            return (
              <li key={a.id}>
                <Link
                  href={`/pacientes/${a.id}`}
                  className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-colors hover:border-teal-300 hover:bg-teal-50/40"
                >
                  <div
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-full",
                      a.especie === "gato" ? "bg-amber-100 text-amber-800" : "bg-teal-100 text-teal-800"
                    )}
                  >
                    <Icone className="size-5.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900">{a.nome}</p>
                    <p className="truncate text-sm text-stone-500">
                      {[ESPECIE_LABEL[a.especie], a.raca, SEXO_LABEL[a.sexo], idadeAnimal(a)]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-stone-700">{a.tutor?.nome}</p>
                    <p className="text-sm text-stone-500">{a.tutor?.telefone}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
