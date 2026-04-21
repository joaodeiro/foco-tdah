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
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1.5 py-2 px-5 rounded-2xl transition-all min-w-[72px]',
                active
                  ? 'text-violet-400'
                  : 'text-zinc-600 hover:text-zinc-400'
              )}
            >
              <div className={cn(
                'relative flex items-center justify-center w-10 h-6 rounded-full transition-all',
                active && 'bg-violet-500/15'
              )}>
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className={cn(
                'text-[11px] font-medium tracking-wide',
                active ? 'text-violet-400' : 'text-zinc-600'
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
