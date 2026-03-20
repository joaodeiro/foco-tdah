'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }

    // Solicitar permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
      // Não solicita imediatamente — só quando o usuário iniciar um timer
    }
  }, [])

  return null
}
