"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { avisarErro } from "@/lib/errors";
import { Button, Card, Field, Input, Spinner } from "@/components/ui";

type PerfilForm = {
  nome: string;
  crmv: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade_uf: string;
};

const perfilVazio: PerfilForm = {
  nome: "",
  crmv: "",
  telefone: "",
  email: "",
  endereco: "",
  cidade_uf: "",
};

export default function ConfiguracoesPage() {
  const [perfil, setPerfil] = useState<PerfilForm>(perfilVazio);
  const [emailConta, setEmailConta] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setEmailConta(user.email ?? "");
      const { data } = await supabase.from("perfis").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        setPerfil({
          nome: data.nome,
          crmv: data.crmv,
          telefone: data.telefone,
          email: data.email,
          endereco: data.endereco,
          cidade_uf: data.cidade_uf,
        });
      }
      setCarregando(false);
    })();
  }, []);

  const set = (campo: keyof PerfilForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPerfil({ ...perfil, [campo]: e.target.value });

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase
        .from("perfis")
        .upsert({ user_id: user.id, ...perfil, updated_at: new Date().toISOString() });
      if (error) {
        avisarErro(error, "salvar o perfil");
        return;
      }
      toast.success("Perfil salvo!");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <Spinner />;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-xl font-bold md:text-2xl">Configurações</h1>
      <p className="mb-5 text-sm text-stone-500">
        Seus dados profissionais — eles aparecem no cabeçalho e na assinatura das receitas, encaminhamentos e
        orçamentos impressos.
      </p>

      <form onSubmit={salvar}>
        <Card className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome completo" className="sm:col-span-2">
            <Input value={perfil.nome} onChange={set("nome")} placeholder="Dra. Fulana de Tal" />
          </Field>
          <Field label="CRMV" hint="Ex.: CRMV-RJ 12345">
            <Input value={perfil.crmv} onChange={set("crmv")} placeholder="CRMV-UF 00000" />
          </Field>
          <Field label="Telefone / WhatsApp">
            <Input value={perfil.telefone} onChange={set("telefone")} placeholder="(00) 00000-0000" />
          </Field>
          <Field label="E-mail profissional" className="sm:col-span-2">
            <Input type="email" value={perfil.email} onChange={set("email")} />
          </Field>
          <Field label="Endereço profissional" className="sm:col-span-2" hint="Obrigatório no receituário de controle especial.">
            <Input value={perfil.endereco} onChange={set("endereco")} placeholder="Rua, número, bairro" />
          </Field>
          <Field label="Cidade / UF">
            <Input value={perfil.cidade_uf} onChange={set("cidade_uf")} placeholder="Ex.: Niterói - RJ" />
          </Field>
          <div className="flex items-end justify-end">
            <Button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar perfil"}
            </Button>
          </div>
        </Card>
      </form>

      <p className="mt-6 text-xs text-stone-400">Conectada como {emailConta}</p>
    </div>
  );
}
