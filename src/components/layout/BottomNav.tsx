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
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-800 px-2 pb-safe-area-inset-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 py-3 px-4 rounded-xl transition-colors min-w-[64px]',
                active ? 'text-violet-400' : 'text-zinc-600 hover:text-zinc-400'
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
