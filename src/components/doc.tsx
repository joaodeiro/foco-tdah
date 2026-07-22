import type { Animal, Perfil, Tutor } from "@/lib/types";
import { ESPECIE_DOC, SEXO_LABEL, fmtDataExtenso, idadeAnimal } from "@/lib/format";

/** Folha branca A4 na tela; conteúdo puro na impressão. */
export function DocFolha({ children }: { children: React.ReactNode }) {
  return (
    <div className="doc mx-auto my-6 w-full max-w-[210mm] bg-white px-[14mm] py-[12mm] text-[13px] leading-relaxed text-black shadow-md print:m-0 print:max-w-none print:p-0 print:shadow-none">
      {children}
    </div>
  );
}

export function DocCabecalho({ perfil }: { perfil: Perfil | null }) {
  return (
    <header className="border-b-2 border-black pb-3 text-center">
      <p className="text-xl font-bold tracking-wide">{perfil?.nome || "Médica Veterinária"}</p>
      <p className="text-sm">
        Médica Veterinária{perfil?.crmv ? ` — ${perfil.crmv}` : ""}
      </p>
      <p className="text-xs text-stone-700">
        {[perfil?.telefone, perfil?.email].filter(Boolean).join(" • ")}
      </p>
      <p className="text-xs text-stone-700">
        {[perfil?.endereco, perfil?.cidade_uf].filter(Boolean).join(" — ")}
      </p>
    </header>
  );
}

export function DocPaciente({ animal, tutor }: { animal: Animal; tutor: Tutor | null }) {
  const idade = idadeAnimal(animal);
  return (
    <section className="my-4 rounded border border-stone-400 px-3 py-2 text-sm">
      <p>
        <strong>Paciente:</strong> {animal.nome}
        {" — "}
        <strong>Espécie:</strong> {ESPECIE_DOC[animal.especie]}
        {animal.raca && (
          <>
            {" — "}
            <strong>Raça:</strong> {animal.raca}
          </>
        )}
      </p>
      <p>
        {animal.sexo && (
          <>
            <strong>Sexo:</strong> {SEXO_LABEL[animal.sexo]}
            {" — "}
          </>
        )}
        {idade && (
          <>
            <strong>Idade:</strong> {idade}
            {" — "}
          </>
        )}
        {animal.peso_kg != null && (
          <>
            <strong>Peso:</strong> {String(animal.peso_kg).replace(".", ",")} kg
          </>
        )}
      </p>
      {tutor && (
        <p>
          <strong>Tutor(a):</strong> {tutor.nome}
          {tutor.cpf && ` — CPF: ${tutor.cpf}`}
          {tutor.telefone && ` — Tel.: ${tutor.telefone}`}
        </p>
      )}
      {tutor?.endereco && (
        <p>
          <strong>Endereço:</strong> {tutor.endereco}
        </p>
      )}
    </section>
  );
}

export function DocAssinatura({ perfil, dataIso }: { perfil: Perfil | null; dataIso: string }) {
  return (
    <footer className="mt-10">
      <p className="mb-10 text-right text-sm">
        {perfil?.cidade_uf ? `${perfil.cidade_uf.split("-")[0].trim()}, ` : ""}
        {fmtDataExtenso(dataIso)}
      </p>
      <div className="mx-auto w-72 border-t border-black pt-1 text-center text-sm">
        <p className="font-semibold">{perfil?.nome || ""}</p>
        <p>{perfil?.crmv ? `Médica Veterinária — ${perfil.crmv}` : "Médica Veterinária"}</p>
      </div>
    </footer>
  );
}
