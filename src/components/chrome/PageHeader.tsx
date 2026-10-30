import type { ReactNode } from 'react'
import { Phrase } from '../motion/Phrase'

type PageHeaderProps = {
  movement: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
}

export function PageHeader({
  movement,
  title,
  intro,
  align = 'left',
}: PageHeaderProps) {
  const centered = align === 'center'

  return (
    <Phrase>
      <header className={centered ? 'text-center' : ''}>
        <p className="label-movement text-gold">{movement}</p>
        <h1
          className={`mt-4 font-display text-[clamp(2.5rem,7vw,4.75rem)] leading-[0.98] font-bold text-ivory ${
            centered ? 'mx-auto' : 'max-w-2xl'
          }`}
        >
          {title}
        </h1>
        {intro && (
          <p
            className={`mt-5 text-[1.0625rem] leading-relaxed text-dust ${
              centered ? 'mx-auto max-w-xl' : 'max-w-xl'
            }`}
          >
            {intro}
          </p>
        )}
        <span
          aria-hidden
          className={`mt-5 block h-px w-24 bg-gradient-to-r from-gold/70 to-transparent ${
            centered ? 'mx-auto bg-gradient-to-r from-transparent via-gold/70 to-transparent' : ''
          }`}
        />
      </header>
    </Phrase>
  )
}
