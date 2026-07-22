"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ConsultaForm } from "@/components/ConsultaForm";

export default function NovaConsultaPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);

  return (
    <div className="max-w-2xl">
      <Link href={`/pacientes/${id}`} className="mb-3 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700">
        <ArrowLeft className="size-4" /> Ficha do paciente
      </Link>
      <h1 className="mb-5 text-xl font-bold md:text-2xl">Nova consulta</h1>
      <ConsultaForm animalId={id} />
    </div>
  );
}
