"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import type { Tutor } from "@/lib/types";
import { parseValor } from "@/lib/format";
import { Button, Card, Field, Select } from "@/components/ui";
import {
  AnimalCampos,
  TutorCampos,
  animalVazio,
  tutorVazio,
  type AnimalForm,
  type TutorForm,
} from "@/components/cadastro";

export default function NovoPacientePage() {
  const router = useRouter();
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [tutorId, setTutorId] = useState<string>("novo");
  const [tutor, setTutor] = useState<TutorForm>(tutorVazio);
  const [animal, setAnimal] = useState<AnimalForm>(animalVazio);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    supabase
      .from("tutores")
      .select("*")
      .order("nome")
      .then(({ data }) => setTutores((data as Tutor[]) ?? []));
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (tutorId === "novo" && !tutor.nome.trim()) {
      toast.error("Informe o nome do tutor.");
      return;
    }
    setSalvando(true);
    try {
      let idTutor = tutorId;

      if (tutorId === "novo") {
        const { data, error } = await supabase
          .from("tutores")
          .insert({ ...tutor, nome: tutor.nome.trim() })
          .select("id")
          .single();
        if (error || !data) {
          toast.error("Não foi possível salvar o tutor.");
          return;
        }
        idTutor = data.id;
      }

      const { data: novoAnimal, error: erroAnimal } = await supabase
        .from("animais")
        .insert({
          tutor_id: idTutor,
          nome: animal.nome.trim(),
          especie: animal.especie,
          raca: animal.raca,
          sexo: animal.sexo,
          nascimento: animal.nascimento || null,
          idade_texto: animal.idade_texto,
          peso_kg: animal.peso ? parseValor(animal.peso) : null,
          pelagem: animal.pelagem,
          castrado: animal.castrado,
          observacoes: animal.observacoes,
        })
        .select("id")
        .single();

      if (erroAnimal || !novoAnimal) {
        toast.error("Não foi possível salvar o animal.");
        return;
      }

      toast.success("Paciente cadastrado!");
      router.push(`/pacientes/${novoAnimal.id}`);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link href="/pacientes" className="mb-3 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700">
        <ArrowLeft className="size-4" /> Pacientes
      </Link>
      <h1 className="mb-5 text-xl font-bold md:text-2xl">Novo cadastro</h1>

      <form onSubmit={salvar} className="space-y-5">
        <Card>
          <h2 className="mb-4 font-semibold text-stone-800">Tutor</h2>
          {tutores.length > 0 && (
            <Field label="Tutor" className="mb-4">
              <Select value={tutorId} onChange={(e) => setTutorId(e.target.value)}>
                <option value="novo">＋ Cadastrar novo tutor</option>
                {tutores.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome} {t.telefone ? `— ${t.telefone}` : ""}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          {tutorId === "novo" && <TutorCampos valor={tutor} aoMudar={setTutor} />}
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-stone-800">Animal</h2>
          <AnimalCampos valor={animal} aoMudar={setAnimal} />
        </Card>

        <div className="flex justify-end gap-2">
          <Link href="/pacientes" className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-stone-600 hover:bg-stone-200/60">
            Cancelar
          </Link>
          <Button type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar cadastro"}
          </Button>
        </div>
      </form>
    </div>
  );
}
