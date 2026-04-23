'use client'

import { useEffect, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { showSuccess } from '@/lib/errors'

interface Profile {
  minutes: number
  label: string
}

const PROFILES: Profile[] = [
  { minutes: 25, label: 'Foco 25' },
  { minutes: 45, label: 'Foco 45' },
  { minutes: 90, label: 'Foco 90' },
]

export default function ShortcutsGuide() {
  const [origin, setOrigin] = useState('')
  const [copiedMinutes, setCopiedMinutes] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  function urlFor(minutes: number) {
    return `${origin}/app?focus=start&duration=${minutes}`
  }

  async function copy(minutes: number) {
    try {
      await navigator.clipboard.writeText(urlFor(minutes))
      setCopiedMinutes(minutes)
      showSuccess('URL copiada.', 'Cole no passo 6 do atalho.')
      setTimeout(() => setCopiedMinutes(null), 2500)
    } catch {
      // usuário pode copiar manualmente
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-serif text-xl text-ink">Integração iOS</h2>
        <p className="text-sm text-ink-muted leading-relaxed mt-1">
          Atalhos que entram em modo foco com um toque: ativam o Foco do
          Apple, silenciam notificações e abrem Kairos numa sessão pronta.
        </p>
      </div>

      <div className="bg-surface border border-hairline rounded-2xl p-5 space-y-4">
        <p className="serial">Criar o atalho</p>
        <ol className="space-y-3 text-[14px] text-ink-muted leading-relaxed">
          <li className="flex gap-3">
            <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-0.5 shrink-0 w-5">01</span>
            <span>Abra o app <span className="text-ink">Atalhos</span> no iPhone e toque em <span className="text-ink">+</span>.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-0.5 shrink-0 w-5">02</span>
            <span>Adicione a ação <span className="text-ink">Definir Modo Foco</span> → escolha Pessoal ou Trabalho → Ligar.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-0.5 shrink-0 w-5">03</span>
            <span>Adicione <span className="text-ink">Não Perturbe</span> → Ligar. (opcional se o Modo Foco já faz isso)</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-0.5 shrink-0 w-5">04</span>
            <span>
              Adicione <span className="text-ink">Definir Filtros de Cores</span> → Ligar → Escala de Cinza.
              <span className="block text-ink-faint mt-1">
                Precisa ativar antes em Ajustes → Acessibilidade → Tamanho e Cor do Texto → Filtros de Cor.
              </span>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-0.5 shrink-0 w-5">05</span>
            <span>Adicione <span className="text-ink">Abrir URL</span> e cole uma das URLs abaixo (escolha a duração).</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-0.5 shrink-0 w-5">06</span>
            <span>Renomeie o atalho (ex.: <em className="font-serif">Foco 25</em>) e toque em concluído.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-0.5 shrink-0 w-5">07</span>
            <span>Adicione à tela de início: toque nos três pontos do atalho → <span className="text-ink">Adicionar à Tela de Início</span>.</span>
          </li>
        </ol>
      </div>

      <div className="space-y-2">
        <p className="serial">URLs para colar no passo 5</p>
        <div className="space-y-2">
          {PROFILES.map(p => (
            <button
              key={p.minutes}
              onClick={() => copy(p.minutes)}
              className="w-full flex items-center justify-between gap-3 bg-surface border border-hairline rounded-xl px-4 py-3 text-left hover:border-ink/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink">{p.label}</p>
                <p className="font-mono text-[10.5px] text-ink-faint truncate mt-0.5">
                  {origin ? urlFor(p.minutes) : '…'}
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
                {copiedMinutes === p.minutes
                  ? <><Check className="w-3.5 h-3.5 text-sage" strokeWidth={2} /> copiado</>
                  : <><Copy className="w-3.5 h-3.5" strokeWidth={1.6} /> copiar</>
                }
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-[13px] text-ink-faint leading-relaxed italic font-serif">
        Dica: toque no atalho da tela de início no momento em que você quer começar. Em 2 segundos, iPhone vai estar em modo foco, tela em cinza, Kairos aberto numa sessão. Baixo custo de entrada, alto custo de saída.
      </p>

      {/* S-01: agenda via Automation */}
      <div className="bg-surface border border-hairline rounded-2xl p-5 space-y-4 mt-4">
        <p className="serial">Agendamento automático</p>
        <p className="text-[14px] text-ink-muted leading-relaxed">
          O iOS pode disparar o atalho em horários fixos. Isso cria
          janelas recorrentes de foco sem depender da sua lembrança.
        </p>
        <ol className="space-y-3 text-[14px] text-ink-muted leading-relaxed">
          <li className="flex gap-3">
            <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-0.5 shrink-0 w-5">01</span>
            <span>No app <span className="text-ink">Atalhos</span>, vá na aba <span className="text-ink">Automação</span> (ícone de relógio).</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-0.5 shrink-0 w-5">02</span>
            <span>Toque em <span className="text-ink">+</span> e escolha <span className="text-ink">Horário</span>.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-0.5 shrink-0 w-5">03</span>
            <span>Defina a hora e os dias da semana (ex.: <em className="font-serif">09:00, seg a sex</em>).</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-0.5 shrink-0 w-5">04</span>
            <span>Em <span className="text-ink">Executar</span>, escolha <span className="text-ink">Imediatamente</span> pra dispensar confirmação manual (ou <span className="text-ink">Ao Executar</span> se preferir avisar).</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-0.5 shrink-0 w-5">05</span>
            <span>Adicione a ação <span className="text-ink">Executar Atalho</span> e escolha o atalho Foco que você criou acima.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-[10px] text-ink-faint tabular-nums mt-0.5 shrink-0 w-5">06</span>
            <span>Concluído. Toda vez que o horário chegar, o iPhone entra em foco e abre Kairos sozinho.</span>
          </li>
        </ol>
        <p className="text-[13px] text-ink-faint leading-relaxed italic font-serif">
          Combinação recomendada: janela de 09:00 a 10:30 de seg a sex com Foco 45, seguida de pausa livre das 10:30 às 11:00. Cadência sustenta melhor que maratona.
        </p>
      </div>
    </section>
  )
}
