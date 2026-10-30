import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function base(props: IconProps) {
  return {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
    ...props,
  }
}

export function IconEmail(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  )
}

export function IconPhone(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 3h3.2l1.3 4.1-2 1.2a12 12 0 0 0 5.2 5.2l1.2-2 4.1 1.3V19a2 2 0 0 1-2.1 2A15 15 0 0 1 5 5.1 2 2 0 0 1 7 3z" />
    </svg>
  )
}

export function IconInstagram(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconFacebook(props: IconProps) {
  return (
    <svg {...base({ ...props, fill: 'currentColor', stroke: 'none' })}>
      <path d="M14 8h3V5h-3c-2.8 0-5 2.2-5 5v2H7v3h2v8h3v-8h3.1l.9-3H12v-2c0-.6.4-1 1-1z" />
    </svg>
  )
}
