"use client";

import { Field, Input, Select, Textarea } from "@/components/ui";
import type { Especie, Sexo } from "@/lib/types";

export type TutorForm = {
  nome: string;
  cpf: string;
  rg: string;
  telefone: string;
  email: string;
  endereco: string;
  observacoes: string;
};

export const tutorVazio: TutorForm = {
  nome: "",
  cpf: "",
  rg: "",
  telefone: "",
  email: "",
  endereco: "",
  observacoes: "",
};

export type AnimalForm = {
  nome: string;
  especie: Especie;
  raca: string;
  sexo: Sexo;
  nascimento: string;
  idade_texto: string;
  peso: string;
  pelagem: string;
  castrado: boolean;
  observacoes: string;
};

export const animalVazio: AnimalForm = {
  nome: "",
  especie: "cao",
  raca: "",
  sexo: "",
  nascimento: "",
  idade_texto: "",
  peso: "",
  pelagem: "",
  castrado: false,
  observacoes: "",
};

export function TutorCampos({
  valor,
  aoMudar,
}: {
  valor: TutorForm;
  aoMudar: (v: TutorForm) => void;
}) {
  const set = (campo: keyof TutorForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    aoMudar({ ...valor, [campo]: e.target.value });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Nome completo *" className="sm:col-span-2">
        <Input required value={valor.nome} onChange={set("nome")} placeholder="Nome do tutor" />
      </Field>
      <Field label="CPF">
        <Input value={valor.cpf} onChange={set("cpf")} placeholder="000.000.000-00" inputMode="numeric" />
      </Field>
      <Field label="RG / Identidade">
        <Input value={valor.rg} onChange={set("rg")} />
      </Field>
      <Field label="Telefone / WhatsApp">
        <Input value={valor.telefone} onChange={set("telefone")} placeholder="(00) 00000-0000" inputMode="tel" />
      </Field>
      <Field label="E-mail">
        <Input type="email" value={valor.email} onChange={set("email")} placeholder="email@exemplo.com" />
      </Field>
      <Field label="Endereço" className="sm:col-span-2" hint="Usado nas receitas controladas e no atendimento a domicílio.">
        <Input value={valor.endereco} onChange={set("endereco")} placeholder="Rua, número, bairro, cidade" />
      </Field>
      <Field label="Observações" className="sm:col-span-2">
        <Textarea rows={2} value={valor.observacoes} onChange={set("observacoes")} />
      </Field>
    </div>
  );
}

const RACAS_CAO = ["SRD (vira-lata)", "Shih Tzu", "Poodle", "Yorkshire", "Lhasa Apso", "Pinscher", "Golden Retriever", "Labrador", "Bulldog Francês", "Spitz Alemão (Lulu)", "Pug", "Dachshund (Salsicha)", "Maltês", "Border Collie", "Pastor Alemão", "Rottweiler", "Pit Bull", "Chow Chow", "Beagle", "Boxer"];
const RACAS_GATO = ["SRD (vira-lata)", "Siamês", "Persa", "Angorá", "Maine Coon", "Ragdoll", "Sphynx", "Bengal", "British Shorthair", "Himalaio"];

export function AnimalCampos({
  valor,
  aoMudar,
}: {
  valor: AnimalForm;
  aoMudar: (v: AnimalForm) => void;
}) {
  const set = (campo: keyof AnimalForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => aoMudar({ ...valor, [campo]: e.target.value });

  const racas = valor.especie === "gato" ? RACAS_GATO : RACAS_CAO;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Nome do animal *">
        <Input required value={valor.nome} onChange={set("nome")} placeholder="Ex.: Martin" />
      </Field>
      <Field label="Espécie *">
        <div className="grid grid-cols-2 gap-2">
          {(["cao", "gato"] as const).map((esp) => (
            <button
              key={esp}
              type="button"
              onClick={() => aoMudar({ ...valor, especie: esp })}
              className={
                "rounded-lg border px-3 py-2 text-sm font-medium transition-colors " +
                (valor.especie === esp
                  ? "border-teal-600 bg-teal-50 text-teal-800"
                  : "border-stone-300 bg-white text-stone-600 hover:bg-stone-50")
              }
            >
              {esp === "cao" ? "🐶 Cão" : "🐱 Gato"}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Raça">
        <Input list="racas-sugeridas" value={valor.raca} onChange={set("raca")} placeholder="Ex.: SRD (vira-lata)" />
        <datalist id="racas-sugeridas">
          {racas.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
      </Field>
      <Field label="Sexo">
        <Select value={valor.sexo} onChange={set("sexo")}>
          <option value="">Não informado</option>
          <option value="macho">Macho</option>
          <option value="femea">Fêmea</option>
        </Select>
      </Field>
      <Field label="Data de nascimento" hint="Se souber a data, a idade é calculada sozinha.">
        <Input type="date" value={valor.nascimento} onChange={set("nascimento")} />
      </Field>
      <Field label="Idade aproximada" hint="Use se não souber a data. Ex.: 3 anos.">
        <Input value={valor.idade_texto} onChange={set("idade_texto")} placeholder="Ex.: 3 anos" />
      </Field>
      <Field label="Peso (kg)">
        <Input value={valor.peso} onChange={set("peso")} placeholder="Ex.: 8,5" inputMode="decimal" />
      </Field>
      <Field label="Pelagem / cor">
        <Input value={valor.pelagem} onChange={set("pelagem")} placeholder="Ex.: caramelo" />
      </Field>
      <label className="flex items-center gap-2 text-sm font-medium text-stone-700 sm:col-span-2">
        <input
          type="checkbox"
          className="size-4 accent-teal-700"
          checked={valor.castrado}
          onChange={(e) => aoMudar({ ...valor, castrado: e.target.checked })}
        />
        Castrado(a)
      </label>
      <Field label="Observações" className="sm:col-span-2" hint="Alergias, temperamento, doenças crônicas...">
        <Textarea rows={2} value={valor.observacoes} onChange={set("observacoes")} />
      </Field>
    </div>
  );
}
