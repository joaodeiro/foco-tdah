import Link from "next/link"
import { ArrowRight, Brain, Timer, Sparkles, Compass } from "lucide-react"

const principles = [
  {
    num: '01',
    icon: Brain,
    title: "Neurociência aplicada",
    body: "Fundamentado no trabalho de Barkley, Hallowell e Brown — não em produtividade genérica.",
  },
  {
    num: '02',
    icon: Sparkles,
    title: "Tarefa em micro-passos",
    body: "A IA quebra qualquer tarefa em ações pequenas o suficiente para começar agora.",
  },
  {
    num: '03',
    icon: Timer,
    title: "Timer contra cegueira temporal",
    body: "Você vê o tempo passando. O cérebro TDAH entende visual, não abstração.",
  },
  {
    num: '04',
    icon: Compass,
    title: "Foco no feito, não no que faltou",
    body: "Diário de conquistas e streaks que celebram o progresso, não a culpa.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="px-6 md:px-10 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl font-serif italic leading-none text-ink">Kairos</span>
          <span className="font-mono text-[10px] text-ink-faint tracking-widest">καιρός</span>
        </div>
        <Link
          href="/auth/login"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted hover:text-ink transition-colors"
        >
          Entrar →
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-10 pt-10 md:pt-20 pb-14 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <span className="serial">§ 00</span>
          <span className="flex-1 h-px bg-hairline" />
          <span className="serial">Para o cérebro 2e · PT-BR</span>
        </div>
        <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight text-ink">
          Produtividade que
          <br />
          trabalha <em className="text-terracotta">com</em> seu
          <br />
          cérebro, não contra.
        </h1>
        <p className="mt-8 max-w-lg text-lg text-ink-muted leading-relaxed">
          Kairos — em grego, o momento oportuno para agir.
          Não o tempo que passa (chronos), mas a janela exata
          em que começar é possível.
        </p>

        <div className="mt-10 flex items-center gap-5 flex-wrap">
          <Link
            href="/auth/login"
            className="group inline-flex items-center gap-2 bg-ink text-background px-6 py-3.5 rounded-full text-[15px] font-medium transition-all hover:bg-terracotta"
          >
            Começar agora
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">Grátis · Sem senha</span>
        </div>
      </section>

      {/* Divider rule */}
      <div className="px-6 md:px-10 max-w-3xl mx-auto">
        <div className="hairline" />
      </div>

      {/* Principles */}
      <section className="px-6 md:px-10 py-16 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <span className="serial">§ 01</span>
          <span className="flex-1 h-px bg-hairline" />
          <span className="serial">Princípios</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
          {principles.map(({ num, icon: Icon, title, body }) => (
            <div key={title} className="space-y-4 relative">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.1em] text-ink-faint tabular-nums">{num}</span>
                <span className="flex-1 h-px bg-hairline/60" />
                <Icon className="w-4 h-4 text-terracotta" strokeWidth={1.6} />
              </div>
              <h3 className="font-serif text-2xl leading-tight text-ink">{title}</h3>
              <p className="text-[15px] text-ink-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <span className="serial">§ 02</span>
          <span className="flex-1 h-px bg-hairline" />
          <span className="serial">Fundamento</span>
        </div>
        <blockquote className="font-serif text-3xl md:text-4xl italic leading-snug text-ink text-center">
          &ldquo;O TDAH não é déficit de atenção. É dificuldade de
          regular a atenção — direcionar ela para onde importa,
          quando importa.&rdquo;
        </blockquote>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint text-center">— Russell Barkley</p>
      </section>

      {/* Final CTA */}
      <section className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <div className="hairline mb-16" />
        <div className="text-center space-y-8">
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-ink">
            Comece onde você está.
            <br />
            <em>Agora.</em>
          </h2>
          <Link
            href="/auth/login"
            className="group inline-flex items-center gap-2 bg-ink text-background px-7 py-4 rounded-full text-[15px] font-medium transition-all hover:bg-terracotta"
          >
            Entrar em Kairos
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-10 pb-10 max-w-3xl mx-auto">
        <div className="hairline mb-6" />
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          <span>Kairos · PT-BR</span>
          <span>V 1.0 · MMXXVI</span>
        </div>
      </footer>
    </div>
  )
}
