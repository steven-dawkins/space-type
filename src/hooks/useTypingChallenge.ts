import { useCallback, useEffect, useState } from 'react'
import { textSamples } from '../data/textSamples'

function pickRandomSample(exclude?: string) {
  const options = exclude
    ? textSamples.filter((sample) => sample !== exclude)
    : textSamples
  return options[Math.floor(Math.random() * options.length)]
}

interface TypingState {
  text: string
  cursor: number
  hasError: boolean
  isComplete: boolean
  startTime: number | null
}

function nextSample(prevText: string): TypingState {
  return {
    text: pickRandomSample(prevText),
    cursor: 0,
    hasError: false,
    isComplete: false,
    startTime: null,
  }
}

export function useTypingChallenge() {
  const [state, setState] = useState<TypingState>(() => nextSample(''))
  const [, forceTick] = useState(0)

  const restart = useCallback(() => {
    setState((prev) => nextSample(prev.text))
  }, [])

  useEffect(() => {
    if (!state.startTime || state.isComplete) return
    const interval = setInterval(() => forceTick((t) => t + 1), 500)
    return () => clearInterval(interval)
  }, [state.startTime, state.isComplete])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return

      if (event.key === 'Enter') {
        setState((prev) => (prev.isComplete ? nextSample(prev.text) : prev))
        return
      }

      if (event.key.length !== 1) return
      event.preventDefault()

      setState((prev) => {
        if (prev.isComplete) return prev

        const expected = prev.text[prev.cursor]
        if (event.key !== expected) {
          return prev.hasError ? prev : { ...prev, hasError: true }
        }

        const cursor = prev.cursor + 1
        return {
          ...prev,
          cursor,
          hasError: false,
          isComplete: cursor === prev.text.length,
          startTime: prev.startTime ?? Date.now(),
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const elapsedMinutes = state.startTime ? (Date.now() - state.startTime) / 60000 : 0
  const wpm = elapsedMinutes > 0 ? Math.round(state.cursor / 5 / elapsedMinutes) : 0

  return {
    text: state.text,
    cursor: state.cursor,
    hasError: state.hasError,
    isComplete: state.isComplete,
    progress: state.cursor / state.text.length,
    wpm,
    restart,
  }
}
