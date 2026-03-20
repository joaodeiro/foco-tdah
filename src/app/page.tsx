import Link from "next/link"
import { Zap, Brain, Timer, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"

const features = [
  {
    icon: Brain,
    text: "Baseado em neurociência do TDAH (Barkley, Hallowell, Brown)",
  },
  {
    icon: Sparkles,
    text: "IA quebra qualquer tarefa em micro-passos acionáveis",
  },
  {
    icon: Timer,
    text: "Timer visual para combater cegueira temporal",
  },
  {
    icon: Zap,
    text: "Celebra o que você fez, não o que faltou",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-10 text-center">

        {/* Brand */}
        <div className="space-y-5">
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Zap className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <span className="text-4xl font-bold text-white tracking-tight">Foco</span>
          </div>
          <h1 className="text-2xl font-semibold text-zinc-100 leading-snug">
            Produtividade construída<br />para o cérebro TDAH
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Sem listas intermináveis. Sem força de vontade.
            <br />
            Com estrutura que funciona <em>com</em> o seu cérebro.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-3 text-left">
          {features.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-violet-400" />
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/auth/login"
          className="block w-full bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-semibold py-4 rounded-2xl transition-all text-center text-base shadow-lg shadow-violet-500/25"
        >
          Começar agora ✨
        </Link>

        <p className="text-sm text-zinc-600">
          PT-BR · Grátis · Sem senha
        </p>
      </div>
    </div>
  )
}
