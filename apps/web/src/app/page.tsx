import Link from "next/link"
import { ArrowRight, Layers, Sparkles, Bookmark, BookOpen } from "lucide-react"

const mechanisms = [
  {
    num: '01',
    icon: Layers,
    title: "Estrutura que sobrevive ao cansaço",
    body: "Sem meta diária obrigatória. Sem streak vermelho. O usuário de terça à noite com pouca energia encontra o mesmo app que deixou. O dia em que você aparece entra. O dia em que você não, fica neutro.",
  },
  {
    num: '02',
    icon: Sparkles,
    title: "IA que quebra a tarefa",
    body: "“Escreva o relatório” vira “abra o documento X, escreva uma frase sobre Y”. O custo cognitivo de começar cai para próximo de zero. É o ponto exato de travamento em TDAH/2e.",
  },
  {
    num: '03',
    icon: Bookmark,
    title: "Contexto salvo entre interrupções",
    body: "Você sai para atender o celular. Volta e vê o que tinha aberto, o próximo passo, onde parou. Retomar deixa de custar reiniciar do zero.",
  },
  {
    num: '04',
    icon: BookOpen,
    title: "Fundamentação real, sem bro-science",
    body: "Desenhado a partir da pesquisa de Barkley, Hallowell, Brown e da literatura sobre dupla excepcionalidade (Silverman, Dabrowski). Sem detox de dopamina. Sem prometer milagre.",
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
          <span className="serial">Acesso Alfa · PT-BR</span>
        </div>
        <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight text-ink">
          O app que você
          <br />
          continua usando
          <br />
          depois do <em className="text-terracotta">dia 15</em>.
        </h1>
        <p className="mt-8 max-w-xl text-lg text-ink-muted leading-relaxed">
          Para quem já abandonou três apps de produtividade. Nenhum deles
          era ruim. O que quebra sempre no dia 15 está em outro lugar.
          É pra isso que Kairos existe.
        </p>

        <div className="mt-10 flex items-center gap-5 flex-wrap">
          <Link
            href="/auth/signup"
            className="group inline-flex items-center gap-2 bg-ink text-background px-6 py-3.5 rounded-full text-[15px] font-medium transition-all hover:bg-terracotta"
          >
            Entrar no Acesso Alfa
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Grátis · Sem cartão
          </span>
        </div>
      </section>

      {/* Divider rule */}
      <div className="px-6 md:px-10 max-w-3xl mx-auto">
        <div className="hairline" />
      </div>

      {/* Problem / pattern recognition */}
      <section className="px-6 md:px-10 py-16 md:py-20 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <span className="serial">§ 01</span>
          <span className="flex-1 h-px bg-hairline" />
          <span className="serial">O padrão</span>
        </div>

        <div className="space-y-6 max-w-xl">
          <p className="font-serif text-2xl md:text-3xl leading-snug text-ink">
            Baixou o Todoist. Abandonou em três semanas.
          </p>
          <p className="font-serif text-2xl md:text-3xl leading-snug text-ink">
            Montou o Notion. Nunca usou o que montou.
          </p>
          <p className="font-serif text-2xl md:text-3xl leading-snug text-ink">
            Voltou pro papel. Perdeu o papel.
          </p>
          <p className="font-serif text-2xl md:text-3xl leading-snug italic text-ink-muted">
            Já olhou a Play Store procurando o próximo.
          </p>
        </div>

        <p className="mt-12 max-w-xl text-[17px] text-ink-muted leading-relaxed">
          O padrão se repete há uns dez anos. E a cada ciclo a voz é a mesma:
          <em className="text-ink"> eu que não tenho disciplina</em>. Essa voz
          está errada. No dia 15, o que falha é a forma como os apps
          assumem que sua cabeça funciona como a de todo mundo.
        </p>
      </section>

      {/* Mechanism */}
      <section className="px-6 md:px-10 py-16 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <span className="serial">§ 02</span>
          <span className="flex-1 h-px bg-hairline" />
          <span className="serial">Como funciona</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
          {mechanisms.map(({ num, icon: Icon, title, body }) => (
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

      {/* Fundamento / authority */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <span className="serial">§ 03</span>
          <span className="flex-1 h-px bg-hairline" />
          <span className="serial">Fundamento</span>
        </div>
        <blockquote className="font-serif text-3xl md:text-4xl italic leading-snug text-ink text-center">
          &ldquo;O TDAH é um transtorno da regulação da atenção: a
          capacidade de dirigi-la para onde importa, quando importa.&rdquo;
        </blockquote>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint text-center">Russell Barkley</p>
      </section>

      {/* Final CTA + stakes */}
      <section className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <div className="hairline mb-16" />
        <div className="flex items-center gap-4 mb-10">
          <span className="serial">§ 04</span>
          <span className="flex-1 h-px bg-hairline" />
          <span className="serial">Começar</span>
        </div>
        <div className="text-center space-y-10">
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-ink max-w-2xl mx-auto">
            Um sistema que continua lá
            <br />
            <em>quando você volta.</em>
          </h2>
          <div className="space-y-4">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 bg-ink text-background px-7 py-4 rounded-full text-[15px] font-medium transition-all hover:bg-terracotta"
            >
              Entrar no Acesso Alfa
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
              Grátis · Sem cartão · Sem compromisso
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-10 pb-10 max-w-3xl mx-auto">
        <div className="hairline mb-6" />
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          <span>Kairos · PT-BR</span>
          <span>V 1.0 Alfa · MMXXVI</span>
        </div>
      </footer>
    </div>
  )
}
