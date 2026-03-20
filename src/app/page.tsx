import Link from "next/link"
import { Zap, Brain, Timer, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-10 text-center">

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">Foco</span>
          </div>
          <h1 className="text-xl font-semibold text-zinc-100 leading-snug">
            Produtividade construída para o cérebro TDAH
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Sem listas intermináveis. Sem força de vontade.
            Com estrutura externa que funciona <em>com</em> o seu cérebro.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 text-left">
          {[
            { icon: Brain, text: "Baseado em neurociência do TDAH (Barkley, Hallowell, Brown)" },
            { icon: Sparkles, text: "IA quebra qualquer tarefa em micro-passos acionáveis" },
            { icon: Timer, text: "Timer visual para combater cegueira temporal" },
            { icon: Zap, text: "Celebra o que você fez, não o que faltou" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3 bg-zinc-900 rounded-xl p-3 border border-zinc-800">
              <Icon className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
              <p className="text-xs text-zinc-400 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <Link
          href="/auth/login"
          className="block w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors text-center"
        >
          Começar agora ✨
        </Link>

        <p className="text-xs text-zinc-700">
          PT-BR · Grátis · Sem senha
        </p>
      </div>
    </div>
  )
}
