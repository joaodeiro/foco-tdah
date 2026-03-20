'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export type TimerState = 'idle' | 'running' | 'paused' | 'finished'

export function useTimer(durationMinutes: number = 25) {
  const [state, setState] = useState<TimerState>('idle')
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60)
  const [totalSeconds] = useState(durationMinutes * 60)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const start = useCallback(() => {
    setState('running')
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setState('finished')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const pause = useCallback(() => {
    clear()
    setState('paused')
  }, [])

  const resume = useCallback(() => {
    start()
  }, [start])

  const reset = useCallback(() => {
    clear()
    setState('idle')
    setSecondsLeft(durationMinutes * 60)
  }, [durationMinutes])

  useEffect(() => () => clear(), [])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return { state, secondsLeft, progress, display, start, pause, resume, reset }
}
