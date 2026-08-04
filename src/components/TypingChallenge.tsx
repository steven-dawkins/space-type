interface TypingChallengeProps {
  text: string
  cursor: number
  hasError: boolean
}

export function TypingChallenge({ text, cursor, hasError }: TypingChallengeProps) {
  return (
    <p className="typing-text">
      {text.split('').map((char, index) => {
        let className = 'pending'
        if (index < cursor) className = 'correct'
        else if (index === cursor) className = hasError ? 'error' : 'current'

        return (
          <span key={index} className={className}>
            {char}
          </span>
        )
      })}
    </p>
  )
}
