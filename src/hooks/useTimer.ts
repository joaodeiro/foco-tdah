'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export type TimerState = 'idle' | 'running' | 'paused' | 'finished'

export function useTimer(durationMinutes: number = 25) {
  const totalSeconds = durationMinutes * 60
  const [state, setState] = useState<TimerState>('idle')
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const endAtRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const tick = useCallback(() => {
    if (endAtRef.current === null) return
    const remaining = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000))
    setSecondsLeft(remaining)
    if (remaining === 0) {
      clear()
      endAtRef.current = null
      setState('finished')
    }
  }, [clear])

  const start = useCallback(() => {
    clear()
    endAtRef.current = Date.now() + secondsLeft * 1000
    setState('running')
    intervalRef.current = setInterval(tick, 250)
  }, [clear, secondsLeft, tick])

  const pause = useCallback(() => {
    if (endAtRef.current !== null) {
      const remaining = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000))
      setSecondsLeft(remaining)
    }
    clear()
    endAtRef.current = null
    setState('paused')
  }, [clear])

  const resume = useCallback(() => {
    start()
  }, [start])

  const reset = useCallback(() => {
    clear()
    endAtRef.current = null
    setState('idle')
    setSecondsLeft(totalSeconds)
  }, [clear, totalSeconds])

  useEffect(() => () => clear(), [clear])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return { state, secondsLeft, progress, display, start, pause, resume, reset }
}
