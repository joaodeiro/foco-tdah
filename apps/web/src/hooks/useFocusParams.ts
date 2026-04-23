'use client'

import { Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Lê parâmetros de deep link que permitem iniciar sessão de foco
 * a partir de URL externa (iOS Shortcut, bookmark, QR).
 *
 * Parâmetros suportados:
 *   ?focus=start          → sinaliza intenção de iniciar foco
 *   ?duration=25          → sobrescreve duração preferida (minutos)
 *   ?taskId=<uuid>        → id exato da tarefa a focar (opcional)
 *   ?task=<titulo>        → título parcial da tarefa a focar (opcional)
 *
 * Exemplo de uso em iOS Shortcut:
 *   Ação "Abrir URL" → https://foco-tdah-chi.vercel.app/app?focus=start&duration=45
 */
export interface FocusParams {
  focus: boolean
  duration: number | null
  taskId: string | null
  taskTitle: string | null
}

export function useFocusParams(): FocusParams {
  const searchParams = useSearchParams()

  return useMemo(() => {
    const focus = searchParams.get('focus') === 'start'
    const durationRaw = searchParams.get('duration')
    const duration = durationRaw ? parseInt(durationRaw, 10) : null
    const taskId = searchParams.get('taskId')
    const taskTitle = searchParams.get('task')

    return {
      focus,
      duration: duration && Number.isFinite(duration) && duration > 0 ? duration : null,
      taskId,
      taskTitle,
    }
  }, [searchParams])
}

/** Wrapper que garante Suspense boundary em torno de useFocusParams. */
export function FocusParamsBoundary({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>
}
