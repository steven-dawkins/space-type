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
  typed: string
  startTime: number | null
}

function nextSample(prevText: string): TypingState {
  return {
    text: pickRandomSample(prevText),
    typed: '',
    startTime: null,
  }
}

function firstErrorIndex(text: string, typed: string) {
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== text[i]) return i
  }
  return -1
}

export function useTypingChallenge() {
  const [state, setState] = useState<TypingState>(() => nextSample(''))
  const [, forceTick] = useState(0)

  const errorIndex = firstErrorIndex(state.text, state.typed)
  const isComplete = state.typed.length === state.text.length && errorIndex === -1

  const restart = useCallback(() => {
    setState((prev) => nextSample(prev.text))
  }, [])

  useEffect(() => {
    if (!state.startTime || isComplete) return
    const interval = setInterval(() => forceTick((t) => t + 1), 500)
    return () => clearInterval(interval)
  }, [state.startTime, isComplete])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return

      if (event.key === 'Enter') {
        setState((prev) =>
          prev.typed.length === prev.text.length && firstErrorIndex(prev.text, prev.typed) === -1
            ? nextSample(prev.text)
            : prev,
        )
        return
      }

      if (event.key === 'Backspace') {
        event.preventDefault()
        setState((prev) => (prev.typed.length === 0 ? prev : { ...prev, typed: prev.typed.slice(0, -1) }))
        return
      }

      if (event.key.length !== 1) return
      event.preventDefault()

      setState((prev) => {
        if (prev.typed.length >= prev.text.length) return prev

        return {
          ...prev,
          typed: prev.typed + event.key,
          startTime: prev.startTime ?? Date.now(),
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const elapsedMinutes = state.startTime ? (Date.now() - state.startTime) / 60000 : 0
  const correctLength = errorIndex === -1 ? state.typed.length : errorIndex
  const wpm = elapsedMinutes > 0 ? Math.round(correctLength / 5 / elapsedMinutes) : 0

  return {
    text: state.text,
    typed: state.typed,
    hasMistake: errorIndex !== -1,
    isComplete,
    progress: correctLength / state.text.length,
    wpm,
    restart,
  }
}
