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

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-hairline pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16 px-2">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-colors min-w-[64px]',
                active ? 'text-ink' : 'text-ink-faint hover:text-ink-muted'
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 1.8 : 1.4} />
              <span className={cn(
                'text-[10px] tracking-wide',
                active ? 'text-ink' : 'text-ink-faint'
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
