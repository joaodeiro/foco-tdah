import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Animal, Perfil, Receita, Tutor } from "@/lib/types";
import { ESPECIE_DOC, SEXO_LABEL, fmtDataExtenso, idadeAnimal } from "@/lib/format";
import { DocAssinatura, DocCabecalho, DocFolha, DocPaciente } from "@/components/doc";
import { PrintToolbar } from "@/components/PrintToolbar";

export default async function ReceitaPrintPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: receita } = await supabase
    .from("receitas")
    .select("*, animal:animais(*, tutor:tutores(*))")
    .eq("id", id)
    .maybeSingle();

  if (!receita) notFound();

  const { data: perfil } = await supabase.from("perfis").select("*").maybeSingle();

  const r = receita as Receita & { animal: Animal & { tutor: Tutor | null } };
  const animal = r.animal;
  const tutor = animal?.tutor ?? null;
  const p = (perfil as Perfil | null) ?? null;

  const aviso = !p?.nome
    ? "Dica: preencha seu nome e CRMV em Configurações para eles saírem no cabeçalho."
    : undefined;

  return (
    <>
      <PrintToolbar voltarPara={`/pacientes/${animal.id}`} aviso={aviso} />

      {r.tipo === "simples" ? (
        <DocFolha>
          <DocCabecalho perfil={p} />
          <h1 className="mt-4 text-center text-base font-bold tracking-widest">RECEITUÁRIO</h1>
          <DocPaciente animal={animal} tutor={tutor} />
          <PrescricaoLista receita={r} />
          {r.observacoes && (
            <p className="mt-4 whitespace-pre-wrap text-sm">
              <strong>Orientações:</strong> {r.observacoes}
            </p>
          )}
          <DocAssinatura perfil={p} dataIso={r.data} />
        </DocFolha>
      ) : (
        <DocFolha>
          <ViaControlada receita={r} animal={animal} tutor={tutor} perfil={p} via="1ª VIA — FARMÁCIA" />
          <div className="my-5 border-t border-dashed border-stone-500 text-center text-[10px] text-stone-500 print:my-4">
            ✂ ······································································································
          </div>
          <ViaControlada receita={r} animal={animal} tutor={tutor} perfil={p} via="2ª VIA — PACIENTE" />
        </DocFolha>
      )}
    </>
  );
}

function PrescricaoLista({ receita, compacta = false }: { receita: Receita; compacta?: boolean }) {
  return (
    <ol className={compacta ? "mt-2 space-y-2" : "mt-6 space-y-4"}>
      {receita.itens.map((item, i) => (
        <li key={i} className="text-sm">
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-bold">
              {i + 1}. {item.medicamento}
            </span>
            {item.quantidade && (
              <span className="shrink-0 whitespace-nowrap">
                {"·".repeat(3)} {item.quantidade}
              </span>
            )}
          </div>
          {item.posologia && <p className="ml-4 whitespace-pre-wrap">{item.posologia}</p>}
        </li>
      ))}
    </ol>
  );
}

function ViaControlada({
  receita,
  animal,
  tutor,
  perfil,
  via,
}: {
  receita: Receita;
  animal: Animal;
  tutor: Tutor | null;
  perfil: Perfil | null;
  via: string;
}) {
  return (
    <section className="via-doc text-[12px]">
      <h1 className="mb-2 text-center text-sm font-bold tracking-widest">
        RECEITUÁRIO DE CONTROLE ESPECIAL
      </h1>

      <div className="flex gap-2">
        <div className="flex-1 rounded border border-black px-2 py-1.5">
          <p className="text-[10px] font-bold">IDENTIFICAÇÃO DO EMITENTE</p>
          <p className="font-semibold">{perfil?.nome || "—"}</p>
          <p>Médica Veterinária {perfil?.crmv ? `— ${perfil.crmv}` : ""}</p>
          <p>{[perfil?.endereco, perfil?.cidade_uf].filter(Boolean).join(" — ")}</p>
          <p>{perfil?.telefone}</p>
        </div>
        <div className="flex w-40 shrink-0 flex-col items-center justify-center rounded border border-black px-2 py-1.5 text-center">
          <p className="text-[11px] font-bold">{via}</p>
          <p className="mt-1 text-[10px]">{fmtDataExtenso(receita.data)}</p>
        </div>
      </div>

      <div className="mt-2 rounded border border-stone-500 px-2 py-1.5">
        <p>
          <strong>Paciente:</strong> {animal.nome} — <strong>Espécie:</strong> {ESPECIE_DOC[animal.especie]}
          {animal.raca && (
            <>
              {" "}
              — <strong>Raça:</strong> {animal.raca}
            </>
          )}
          {animal.sexo && (
            <>
              {" "}
              — <strong>Sexo:</strong> {SEXO_LABEL[animal.sexo]}
            </>
          )}
          {idadeAnimal(animal) && (
            <>
              {" "}
              — <strong>Idade:</strong> {idadeAnimal(animal)}
            </>
          )}
        </p>
        <p>
          <strong>Proprietário(a):</strong> {tutor?.nome || "—"}
          {tutor?.cpf && ` — CPF: ${tutor.cpf}`}
        </p>
        {tutor?.endereco && (
          <p>
            <strong>Endereço:</strong> {tutor.endereco}
          </p>
        )}
      </div>

      <PrescricaoLista receita={receita} compacta />

      {receita.observacoes && (
        <p className="mt-2 whitespace-pre-wrap">
          <strong>Orientações:</strong> {receita.observacoes}
        </p>
      )}

      <div className="mt-4 flex items-end gap-2">
        <div className="flex-1 rounded border border-black px-2 py-1.5">
          <p className="text-[10px] font-bold">IDENTIFICAÇÃO DO COMPRADOR</p>
          <p className="mt-2 border-b border-dotted border-stone-500">Nome:</p>
          <p className="mt-2 border-b border-dotted border-stone-500">RG:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Telefone:</p>
          <p className="mt-2 border-b border-dotted border-stone-500">Endereço:</p>
          <p className="mt-2">Cidade/UF:</p>
        </div>
        <div className="flex-1 rounded border border-black px-2 py-1.5">
          <p className="text-[10px] font-bold">IDENTIFICAÇÃO DO FORNECEDOR</p>
          <p className="mt-2 border-b border-dotted border-stone-500">Data:</p>
          <p className="mt-7 border-t border-stone-500 pt-0.5 text-center text-[10px]">
            Assinatura do farmacêutico
          </p>
        </div>
        <div className="w-56 shrink-0 text-center">
          <div className="border-t border-black pt-1">
            <p className="font-semibold">{perfil?.nome || ""}</p>
            <p className="text-[10px]">{perfil?.crmv ? `Médica Veterinária — ${perfil.crmv}` : "Assinatura e carimbo"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
