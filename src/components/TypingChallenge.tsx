interface TypingChallengeProps {
  text: string
  typed: string
}

export function TypingChallenge({ text, typed }: TypingChallengeProps) {
  return (
    <p className="typing-text">
      {text.split('').map((char, index) => {
        let className = 'pending'
        if (index < typed.length) className = typed[index] === char ? 'correct' : 'error'
        else if (index === typed.length) className = 'current'

        return (
          <span key={index} className={className}>
            {char}
          </span>
        )
      })}
    </p>
  )
}
