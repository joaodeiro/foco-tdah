'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import ChatSheet from './ChatSheet'

export default function ChatFAB() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Conversar com Kairos"
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-40 w-14 h-14 bg-ink hover:bg-terracotta text-background rounded-full shadow-lg shadow-ink/15 flex items-center justify-center transition-all active:scale-90"
      >
        <MessageCircle className="w-6 h-6" strokeWidth={1.8} />
      </button>

      <ChatSheet open={open} onClose={() => setOpen(false)} />
    </>
  )
}
