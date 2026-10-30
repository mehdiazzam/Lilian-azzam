import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const RUBATO: [number, number, number, number] = [0.16, 1, 0.24, 1]

type PhraseProps = {
  children: ReactNode
  className?: string

  beat?: number
  delay?: number
}

export function Phrase({
  children,
  className,
  beat = 0,
  delay = 0,
}: PhraseProps) {
  const reduce = useReducedMotion()
  const phraseDelay = delay + beat * 0.11
  const duration = 0.55 + (beat % 3) * 0.12

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration, ease: RUBATO, delay: phraseDelay }}
    >
      {children}
    </motion.div>
  )
}

type VibratoProps = {
  children: ReactNode
  className?: string
}

export function Vibrato({ children, className }: VibratoProps) {
  const reduce = useReducedMotion()
  if (reduce) {
    return <span className={className}>{children}</span>
  }

  return (
    <motion.span
      className={`inline-block ${className ?? ''}`}
      whileHover={{
        y: [0, -1.5, 0, 1.5, 0],
        transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {children}
    </motion.span>
  )
}
