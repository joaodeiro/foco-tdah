'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, CheckSquare, BookOpen, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/app', label: 'Hoje', num: 'I', icon: Calendar },
  { href: '/app/tasks', label: 'Tarefas', num: 'II', icon: CheckSquare },
  { href: '/app/journal', label: 'Diário', num: 'III', icon: BookOpen },
  { href: '/app/profile', label: 'Perfil', num: 'IV', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-60 lg:w-72 shrink-0 border-r border-hairline flex-col sticky top-0 h-screen">
      <div className="px-8 pt-10 pb-14">
        <Link href="/app" className="block space-y-1">
          <span className="text-2xl font-serif italic leading-none text-ink block">Kairos</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">καιρός · v1.0</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {nav.map(({ href, label, num, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-4 px-4 py-2.5 rounded-xl transition-colors text-[15px] group',
                active
                  ? 'bg-surface text-ink'
                  : 'text-ink-muted hover:text-ink hover:bg-surface/60'
              )}
            >
              <span className={cn(
                'font-mono text-[10px] tracking-[0.1em] w-4',
                active ? 'text-terracotta' : 'text-ink-faint group-hover:text-ink-muted'
              )}>
                {num}
              </span>
              <Icon className="w-4 h-4" strokeWidth={active ? 1.8 : 1.4} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-8 pb-8 pt-6 border-t border-hairline">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          Estrutura externa &middot; que funciona com seu cérebro
        </p>
      </div>
    </aside>
  )
}
