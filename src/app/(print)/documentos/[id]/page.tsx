import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Animal, Documento, Perfil, Tutor } from "@/lib/types";
import { DocAssinatura, DocCabecalho, DocFolha, DocPaciente } from "@/components/doc";
import { PrintToolbar } from "@/components/PrintToolbar";

export default async function DocumentoPrintPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: documento } = await supabase
    .from("documentos")
    .select("*, animal:animais(*, tutor:tutores(*))")
    .eq("id", id)
    .maybeSingle();

  if (!documento) notFound();

  const { data: perfil } = await supabase.from("perfis").select("*").maybeSingle();

  const d = documento as Documento & { animal: Animal & { tutor: Tutor | null } };
  const animal = d.animal;
  const p = (perfil as Perfil | null) ?? null;

  return (
    <>
      <PrintToolbar
        voltarPara={`/pacientes/${animal.id}`}
        aviso={!p?.nome ? "Dica: preencha seu nome e CRMV em Configurações para eles saírem no cabeçalho." : undefined}
      />
      <DocFolha>
        <DocCabecalho perfil={p} />
        <h1 className="mt-4 text-center text-base font-bold uppercase tracking-widest">
          {d.titulo || "Documento"}
        </h1>
        <DocPaciente animal={animal} tutor={animal.tutor ?? null} />
        <div className="mt-6 min-h-48 whitespace-pre-wrap text-sm leading-7">{d.conteudo}</div>
        <DocAssinatura perfil={p} dataIso={d.data} />
      </DocFolha>
    </>
  );
}
