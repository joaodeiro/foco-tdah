import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Animal, Orcamento, Perfil, Tutor } from "@/lib/types";
import { ESPECIE_DOC, brl, fmtData, totalOrcamento } from "@/lib/format";
import { DocAssinatura, DocCabecalho, DocFolha } from "@/components/doc";
import { PrintToolbar } from "@/components/PrintToolbar";

export default async function OrcamentoPrintPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: orcamento } = await supabase
    .from("orcamentos")
    .select("*, animal:animais(*, tutor:tutores(*)), tutor:tutores(*)")
    .eq("id", id)
    .maybeSingle();

  if (!orcamento) notFound();

  const { data: perfil } = await supabase.from("perfis").select("*").maybeSingle();

  const o = orcamento as unknown as Orcamento & {
    animal: (Animal & { tutor: Tutor | null }) | null;
    tutor: Tutor | null;
  };
  const p = (perfil as Perfil | null) ?? null;
  const tutor = o.animal?.tutor ?? o.tutor ?? null;
  const subtotal = o.itens.reduce((acc, i) => acc + i.qtd * i.valor, 0);
  const total = totalOrcamento(o.itens, o.desconto);

  return (
    <>
      <PrintToolbar
        voltarPara={o.animal ? `/pacientes/${o.animal.id}` : "/orcamentos"}
        aviso={!p?.nome ? "Dica: preencha seu nome e CRMV em Configurações para eles saírem no cabeçalho." : undefined}
      />
      <DocFolha>
        <DocCabecalho perfil={p} />
        <h1 className="mt-4 text-center text-base font-bold tracking-widest">ORÇAMENTO</h1>

        <section className="my-4 text-sm">
          <p>
            <strong>Data:</strong> {fmtData(o.data)}
          </p>
          {o.animal && (
            <p>
              <strong>Paciente:</strong> {o.animal.nome} — {ESPECIE_DOC[o.animal.especie]}
              {o.animal.raca ? `, ${o.animal.raca}` : ""}
            </p>
          )}
          {tutor && (
            <p>
              <strong>Tutor(a):</strong> {tutor.nome}
              {tutor.telefone ? ` — Tel.: ${tutor.telefone}` : ""}
            </p>
          )}
        </section>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-black text-left">
              <th className="py-1.5 pr-2">Descrição</th>
              <th className="w-14 py-1.5 text-center">Qtd</th>
              <th className="w-28 py-1.5 text-right">Valor unit.</th>
              <th className="w-28 py-1.5 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {o.itens.map((item, i) => (
              <tr key={i} className="border-b border-stone-300">
                <td className="py-1.5 pr-2">{item.descricao}</td>
                <td className="py-1.5 text-center">{String(item.qtd).replace(".", ",")}</td>
                <td className="py-1.5 text-right">{brl(item.valor)}</td>
                <td className="py-1.5 text-right">{brl(item.qtd * item.valor)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {o.desconto > 0 && (
              <>
                <tr>
                  <td colSpan={3} className="py-1 text-right">
                    Subtotal
                  </td>
                  <td className="py-1 text-right">{brl(subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-1 text-right">
                    Desconto
                  </td>
                  <td className="py-1 text-right">− {brl(o.desconto)}</td>
                </tr>
              </>
            )}
            <tr className="border-t-2 border-black text-base font-bold">
              <td colSpan={3} className="py-2 text-right">
                TOTAL
              </td>
              <td className="py-2 text-right">{brl(total)}</td>
            </tr>
          </tfoot>
        </table>

        {o.observacoes && (
          <p className="mt-4 whitespace-pre-wrap text-sm">
            <strong>Observações:</strong> {o.observacoes}
          </p>
        )}

        <DocAssinatura perfil={p} dataIso={o.data} />
      </DocFolha>
    </>
  );
}
