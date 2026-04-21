import Link from "next/link"
import { ArrowRight, Brain, Timer, Sparkles, Compass } from "lucide-react"

const principles = [
  {
    icon: Brain,
    title: "Neurociência aplicada",
    body: "Fundamentado no trabalho de Barkley, Hallowell e Brown — não em produtividade genérica.",
  },
  {
    icon: Sparkles,
    title: "Tarefa em micro-passos",
    body: "A IA quebra qualquer tarefa em ações pequenas o suficiente para começar agora.",
  },
  {
    icon: Timer,
    title: "Timer contra cegueira temporal",
    body: "Você vê o tempo passando. O cérebro TDAH entende visual, não abstração.",
  },
  {
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
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-serif italic leading-none text-ink">Foco</span>
          <span className="w-1 h-1 rounded-full bg-terracotta" />
        </div>
        <Link
          href="/auth/login"
          className="text-sm text-ink-muted hover:text-ink transition-colors"
        >
          Entrar
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-10 pt-10 md:pt-20 pb-14 max-w-3xl mx-auto">
        <p className="eyebrow mb-6">Para o cérebro 2e · PT-BR</p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight text-ink">
          Produtividade que
          <br />
          trabalha <em className="text-terracotta">com</em> seu
          <br />
          cérebro, não contra.
        </h1>
        <p className="mt-8 max-w-lg text-lg text-ink-muted leading-relaxed">
          Sem listas intermináveis. Sem força de vontade.
          Estrutura externa pensada para como a mente TDAH
          realmente funciona.
        </p>

        <div className="mt-10 flex items-center gap-5">
          <Link
            href="/auth/login"
            className="group inline-flex items-center gap-2 bg-ink text-background px-6 py-3.5 rounded-full text-[15px] font-medium transition-all hover:bg-terracotta"
          >
            Começar agora
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <span className="text-sm text-ink-faint">Grátis · Sem senha</span>
        </div>
      </section>

      {/* Divider rule */}
      <div className="px-6 md:px-10 max-w-3xl mx-auto">
        <div className="hairline" />
      </div>

      {/* Principles */}
      <section className="px-6 md:px-10 py-16 max-w-3xl mx-auto">
        <p className="eyebrow mb-10">Princípios</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          {principles.map(({ icon: Icon, title, body }) => (
            <div key={title} className="space-y-3">
              <Icon className="w-5 h-5 text-terracotta" strokeWidth={1.6} />
              <h3 className="font-serif text-2xl leading-tight text-ink">{title}</h3>
              <p className="text-[15px] text-ink-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto text-center">
        <blockquote className="font-serif text-3xl md:text-4xl italic leading-snug text-ink">
          &ldquo;O TDAH não é déficit de atenção. É dificuldade de
          regular a atenção — direcionar ela para onde importa,
          quando importa.&rdquo;
        </blockquote>
        <p className="mt-6 eyebrow">— Russell Barkley</p>
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
            Entrar com link mágico
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-10 pb-10 max-w-3xl mx-auto">
        <div className="hairline mb-6" />
        <div className="flex items-center justify-between text-xs text-ink-faint">
          <span>Foco · Feito com cuidado em PT-BR</span>
          <span>2025</span>
        </div>
      </footer>
    </div>
  )
}
