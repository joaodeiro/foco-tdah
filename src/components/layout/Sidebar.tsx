'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, CheckSquare, BookOpen, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/app', label: 'Hoje', icon: Calendar },
  { href: '/app/tasks', label: 'Tarefas', icon: CheckSquare },
  { href: '/app/journal', label: 'Diário', icon: BookOpen },
  { href: '/app/profile', label: 'Perfil', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-60 lg:w-72 shrink-0 border-r border-hairline flex-col sticky top-0 h-screen">
      <div className="px-8 pt-10 pb-14">
        <Link href="/app" className="inline-flex items-center gap-2.5">
          <span className="text-2xl font-serif italic leading-none text-ink">Foco</span>
          <span className="w-1 h-1 rounded-full bg-terracotta" />
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-[15px]',
                active
                  ? 'bg-surface text-ink'
                  : 'text-ink-muted hover:text-ink hover:bg-surface/60'
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={active ? 1.8 : 1.4} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-8 pb-8 pt-6 border-t border-hairline">
        <p className="text-[11px] text-ink-faint italic font-serif leading-relaxed">
          Estrutura externa que funciona com seu cérebro.
        </p>
      </div>
    </aside>
  )
}
