"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PawPrint } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button, Card, Field, Input } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    try {
      if (modo === "entrar") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) {
          toast.error("Não foi possível entrar. Confira o e-mail e a senha.");
          return;
        }
        router.push("/pacientes");
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password: senha });
        if (error) {
          toast.error("Não foi possível criar a conta. Tente novamente.");
          return;
        }
        if (!data.session) {
          toast.success("Conta criada! Confira seu e-mail para confirmar o cadastro.");
          setModo("entrar");
          return;
        }
        router.push("/pacientes");
        router.refresh();
      }
    } finally {
      setCarregando(false);
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
            <Field label="Senha">
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
            <Button type="submit" className="w-full" disabled={carregando}>
              {carregando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-4 w-full text-center text-sm text-teal-700 hover:underline"
            onClick={() => setModo(modo === "entrar" ? "criar" : "entrar")}
          >
            {modo === "entrar" ? "Primeira vez? Criar conta" : "Já tenho conta — entrar"}
          </button>
        </Card>
      </div>
    </main>
  );
}
