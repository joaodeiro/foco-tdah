import type { OrcamentoItem } from "./types";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const ESPECIE_LABEL: Record<string, string> = { cao: "Cão", gato: "Gato" };
export const ESPECIE_DOC: Record<string, string> = { cao: "Canina", gato: "Felina" };
export const SEXO_LABEL: Record<string, string> = { macho: "Macho", femea: "Fêmea", "": "" };

export function brl(valor: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

export function parseValor(texto: string): number {
  const n = parseFloat(texto.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export function fmtData(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
}

export function fmtDataHora(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR")} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

export function fmtDataExtenso(iso: string | null | undefined) {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

/** Valor atual para um input datetime-local (fuso local). */
export function agoraLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function isoParaInputLocal(iso: string) {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

/** Idade calculada a partir do nascimento, ou o texto livre informado. */
export function idadeAnimal(a: { nascimento: string | null; idade_texto: string }): string {
  if (a.nascimento) {
    const n = new Date(a.nascimento + "T00:00:00");
    const hoje = new Date();
    let meses = (hoje.getFullYear() - n.getFullYear()) * 12 + (hoje.getMonth() - n.getMonth());
    if (hoje.getDate() < n.getDate()) meses--;
    if (meses <= 0) return "menos de 1 mês";
    const anos = Math.floor(meses / 12);
    const resto = meses % 12;
    if (anos === 0) return `${meses} ${meses === 1 ? "mês" : "meses"}`;
    const parteAnos = `${anos} ${anos === 1 ? "ano" : "anos"}`;
    if (resto === 0) return parteAnos;
    return `${parteAnos} e ${resto} ${resto === 1 ? "mês" : "meses"}`;
  }
  return a.idade_texto;
}

export function totalOrcamento(itens: OrcamentoItem[], desconto = 0) {
  const soma = itens.reduce((acc, i) => acc + (i.qtd || 0) * (i.valor || 0), 0);
  return Math.max(soma - (desconto || 0), 0);
}
