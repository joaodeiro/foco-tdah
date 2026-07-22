"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MailCheck, PawPrint } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { traduzirErroAuth, type ErroTraduzido } from "@/lib/errors";
import { Button, Card, Field, Input } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<ErroTraduzido | null>(null);
  const [aguardandoConfirmacao, setAguardandoConfirmacao] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  function trocarModo() {
    setErro(null);
    setModo(modo === "entrar" ? "criar" : "entrar");
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      if (modo === "entrar") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) {
          setErro(traduzirErroAuth(error, "entrar"));
          return;
        }
        router.push("/pacientes");
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: { emailRedirectTo: `${window.location.origin}/login` },
        });
        if (error) {
          setErro(traduzirErroAuth(error, "criar"));
          return;
        }
        // Quando o e-mail já tem conta, o Supabase responde "sucesso" com
        // identities vazio — sem tratar isso, a pessoa acharia que criou
        // uma conta nova e ficaria presa esperando um e-mail que não vem.
        if (data.user && !data.session && (data.user.identities?.length ?? 0) === 0) {
          setModo("entrar");
          setErro(traduzirErroAuth({ code: "user_already_exists", message: "" }, "criar"));
          return;
        }
        if (!data.session) {
          setAguardandoConfirmacao(email);
          return;
        }
        router.push("/pacientes");
        router.refresh();
      }
    } finally {
      setCarregando(false);
    }
  }

  async function reenviarConfirmacao() {
    if (!aguardandoConfirmacao) return;
    setReenviando(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: aguardandoConfirmacao,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });
      if (error) {
        setErro(traduzirErroAuth(error, "criar"));
        return;
      }
      toast.success("E-mail reenviado!", {
        description: `Confira a caixa de entrada (e o spam) de ${aguardandoConfirmacao}.`,
        duration: 6000,
      });
    } finally {
      setReenviando(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-700 text-white">
            <PawPrint className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-teal-900">gestaovet</h1>
          <p className="text-sm text-stone-500">Atendimento veterinário a domicílio</p>
        </div>

        {aguardandoConfirmacao ? (
          <Card className="space-y-4 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
              <MailCheck className="size-6" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-900">Falta só confirmar seu e-mail</h2>
              <p className="mt-2 text-sm text-stone-600">
                Enviamos um link de confirmação para{" "}
                <strong className="text-stone-900">{aguardandoConfirmacao}</strong>. Abra o e-mail e
                toque no link para ativar a conta — se não encontrar, olhe também o spam e a aba
                Promoções.
              </p>
              <p className="mt-2 text-sm text-stone-600">Depois é só voltar aqui e entrar.</p>
            </div>
            {erro && <CaixaErro erro={erro} />}
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  setAguardandoConfirmacao(null);
                  setErro(null);
                  setModo("entrar");
                }}
              >
                Já confirmei — entrar
              </Button>
              <Button variant="secondary" className="w-full" onClick={reenviarConfirmacao} disabled={reenviando}>
                {reenviando ? "Reenviando..." : "Não chegou? Reenviar e-mail"}
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <form onSubmit={enviar} className="space-y-4">
              <Field label="E-mail">
                <Input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                />
              </Field>
              <Field label="Senha" hint={modo === "criar" ? "Pelo menos 6 caracteres." : undefined}>
                <Input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={modo === "entrar" ? "current-password" : "new-password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                />
              </Field>

              {erro && <CaixaErro erro={erro} />}

              <Button type="submit" className="w-full" disabled={carregando}>
                {carregando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar conta"}
              </Button>
            </form>

            <button
              type="button"
              className="mt-4 w-full text-center text-sm text-teal-700 hover:underline"
              onClick={trocarModo}
            >
              {modo === "entrar" ? "Primeira vez? Criar conta" : "Já tenho conta — entrar"}
            </button>
          </Card>
        )}
      </div>
    </main>
  );
}

function CaixaErro({ erro }: { erro: ErroTraduzido }) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-left">
      <p className="text-sm font-semibold text-red-800">{erro.titulo}</p>
      <p className="mt-0.5 text-sm text-red-700">{erro.descricao}</p>
    </div>
  );
}
