"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import type { Consulta } from "@/lib/types";
import { Spinner } from "@/components/ui";
import { ConsultaForm } from "@/components/ConsultaForm";

export default function EditarConsultaPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const router = useRouter();
  const [consulta, setConsulta] = useState<Consulta | null>(null);

  useEffect(() => {
    supabase
      .from("consultas")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error("Consulta não encontrada", {
            description: "Ela pode ter sido excluída. Voltamos para a lista de pacientes.",
          });
          router.push("/pacientes");
          return;
        }
        setConsulta(data as Consulta);
      });
  }, [id, router]);

  if (!consulta) return <Spinner />;

  return (
    <div className="max-w-2xl">
      <Link
        href={`/pacientes/${consulta.animal_id}`}
        className="mb-3 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
      >
        <ArrowLeft className="size-4" /> Ficha do paciente
      </Link>
      <h1 className="mb-5 text-xl font-bold md:text-2xl">Editar consulta</h1>
      <ConsultaForm animalId={consulta.animal_id} consulta={consulta} />
    </div>
  );
}
