"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import type { Animal } from "@/lib/types";
import { parseValor } from "@/lib/format";
import { Button, Card, Spinner } from "@/components/ui";
import {
  AnimalCampos,
  TutorCampos,
  animalVazio,
  tutorVazio,
  type AnimalForm,
  type TutorForm,
} from "@/components/cadastro";

export default function EditarPacientePage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();

  const [tutorId, setTutorId] = useState<string | null>(null);
  const [tutor, setTutor] = useState<TutorForm>(tutorVazio);
  const [animal, setAnimal] = useState<AnimalForm>(animalVazio);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    supabase
      .from("animais")
      .select("*, tutor:tutores(*)")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error("Paciente não encontrado.");
          router.push("/pacientes");
          return;
        }
        const a = data as Animal;
        setAnimal({
          nome: a.nome,
          especie: a.especie,
          raca: a.raca,
          sexo: a.sexo,
          nascimento: a.nascimento ?? "",
          idade_texto: a.idade_texto,
          peso: a.peso_kg != null ? String(a.peso_kg).replace(".", ",") : "",
          pelagem: a.pelagem,
          castrado: a.castrado ?? false,
          observacoes: a.observacoes,
        });
        if (a.tutor) {
          setTutorId(a.tutor.id);
          setTutor({
            nome: a.tutor.nome,
            cpf: a.tutor.cpf,
            rg: a.tutor.rg,
            telefone: a.tutor.telefone,
            email: a.tutor.email,
            endereco: a.tutor.endereco,
            observacoes: a.tutor.observacoes,
          });
        }
        setCarregando(false);
      });
  }, [id, router]);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      const { error: erroAnimal } = await supabase
        .from("animais")
        .update({
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
        .eq("id", id);

      const { error: erroTutor } = tutorId
        ? await supabase.from("tutores").update({ ...tutor, nome: tutor.nome.trim() }).eq("id", tutorId)
        : { error: null };

      if (erroAnimal || erroTutor) {
        toast.error("Não foi possível salvar as alterações.");
        return;
      }
      toast.success("Dados atualizados!");
      router.push(`/pacientes/${id}`);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <Spinner />;

  return (
    <div className="max-w-2xl">
      <Link href={`/pacientes/${id}`} className="mb-3 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700">
        <ArrowLeft className="size-4" /> Ficha do paciente
      </Link>
      <h1 className="mb-5 text-xl font-bold md:text-2xl">Editar dados</h1>

      <form onSubmit={salvar} className="space-y-5">
        <Card>
          <h2 className="mb-4 font-semibold text-stone-800">Animal</h2>
          <AnimalCampos valor={animal} aoMudar={setAnimal} />
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-stone-800">Tutor</h2>
          <TutorCampos valor={tutor} aoMudar={setTutor} />
        </Card>

        <div className="flex justify-end gap-2">
          <Link href={`/pacientes/${id}`} className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-stone-600 hover:bg-stone-200/60">
            Cancelar
          </Link>
          <Button type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
