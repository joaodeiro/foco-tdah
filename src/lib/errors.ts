"use client";

import { toast } from "sonner";

// Tradução de erros para mensagens úteis, seguindo as convenções de
// usabilidade (Nielsen #9): dizer em linguagem simples O QUE deu errado,
// POR QUE (quando se sabe) e O QUE a pessoa pode fazer para resolver.
// Catálogo completo em docs/messages.md — manter os dois em dia.

export type ErroTraduzido = { titulo: string; descricao: string };

function mensagemDe(erro: unknown): string {
  if (!erro) return "";
  if (typeof erro === "string") return erro;
  if (erro instanceof Error) return erro.message;
  if (typeof erro === "object" && "message" in erro) {
    return String((erro as { message?: unknown }).message ?? "");
  }
  return String(erro);
}

function codigoDe(erro: unknown): string {
  if (erro && typeof erro === "object" && "code" in erro) {
    return String((erro as { code?: unknown }).code ?? "");
  }
  return "";
}

function ehErroDeRede(msg: string): boolean {
  const m = msg.toLowerCase();
  return m.includes("fetch") || m.includes("network") || m.includes("load failed");
}

export function traduzirErroAuth(erro: unknown, contexto: "entrar" | "criar"): ErroTraduzido {
  const codigo = codigoDe(erro);
  const msg = mensagemDe(erro);
  const m = msg.toLowerCase();

  if (ehErroDeRede(msg)) {
    return {
      titulo: "Sem conexão com o servidor",
      descricao: "Verifique o Wi‑Fi ou os dados móveis do aparelho e tente de novo.",
    };
  }
  if (codigo === "invalid_credentials" || m.includes("invalid login credentials")) {
    return {
      titulo: "E-mail ou senha incorretos",
      descricao:
        "Confira os dados digitados e tente de novo. Se ainda não tem conta, toque em “Primeira vez? Criar conta”.",
    };
  }
  if (codigo === "email_not_confirmed" || m.includes("not confirmed")) {
    return {
      titulo: "Falta confirmar seu e-mail",
      descricao:
        "Quando a conta foi criada, enviamos um link de confirmação para o seu e-mail. Abra o link (vale olhar o spam) e depois tente entrar de novo.",
    };
  }
  if (codigo === "user_already_exists" || codigo === "email_exists" || m.includes("already registered")) {
    return {
      titulo: "Esse e-mail já tem conta",
      descricao: "Toque em “Já tenho conta — entrar” e use a senha que você criou.",
    };
  }
  if (codigo === "weak_password" || m.includes("password should be")) {
    return {
      titulo: "Senha muito curta",
      descricao: "Use uma senha com pelo menos 6 caracteres.",
    };
  }
  if (codigo === "email_address_invalid" || codigo === "validation_failed") {
    return {
      titulo: "E-mail inválido",
      descricao: "Confira se o e-mail foi digitado certinho, no formato nome@exemplo.com.",
    };
  }
  if (codigo === "over_email_send_rate_limit" || codigo === "over_request_rate_limit" || m.includes("rate limit")) {
    return {
      titulo: "Muitas tentativas seguidas",
      descricao: "Por segurança, aguarde uns 5 minutos antes de tentar de novo.",
    };
  }
  return {
    titulo: contexto === "entrar" ? "Não foi possível entrar" : "Não foi possível criar a conta",
    descricao: `Aconteceu um erro inesperado${msg ? ` (“${msg}”)` : ""}. Tente de novo em instantes; se continuar, mostre esta mensagem para quem cuida do sistema.`,
  };
}

export function traduzirErroBanco(erro: unknown, acao: string): ErroTraduzido {
  const codigo = codigoDe(erro);
  const msg = mensagemDe(erro);
  const m = msg.toLowerCase();

  if (ehErroDeRede(msg)) {
    return {
      titulo: `Não deu para ${acao}`,
      descricao:
        "O aparelho parece estar sem internet. Verifique o Wi‑Fi ou os dados móveis e tente de novo — o que você digitou continua na tela.",
    };
  }
  if (codigo === "PGRST301" || m.includes("jwt")) {
    return {
      titulo: "Sua sessão expirou",
      descricao: "Por segurança, saia e entre de novo na conta. Depois repita a ação.",
    };
  }
  if (codigo === "42501" || m.includes("row-level security")) {
    return {
      titulo: `Não deu para ${acao}`,
      descricao: "Sua conta não tem permissão para esse registro. Saia e entre de novo; se continuar, mostre esta mensagem para quem cuida do sistema.",
    };
  }
  if (codigo === "23505" || m.includes("duplicate key")) {
    return {
      titulo: "Registro duplicado",
      descricao: "Já existe um registro igual a esse. Confira a lista antes de salvar de novo.",
    };
  }
  return {
    titulo: `Não deu para ${acao}`,
    descricao: `Tente de novo em instantes. Se continuar acontecendo, mostre este detalhe para quem cuida do sistema: “${msg || "erro desconhecido"}”.`,
  };
}

/** Toast de erro padronizado: título = o que falhou, descrição = por que e o que fazer. */
export function avisarErro(erro: unknown, acao: string) {
  const t = traduzirErroBanco(erro, acao);
  toast.error(t.titulo, { description: t.descricao, duration: 6000 });
}
