import type { SVGProps } from 'react'

export function OperaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={26}
      height={26}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden
      {...props}
    >

      <ellipse cx="8.5" cy="24" rx="4.2" ry="3.2" transform="rotate(-18 8.5 24)" />

      <ellipse cx="20.5" cy="21" rx="4.2" ry="3.2" transform="rotate(-18 20.5 21)" />

      <rect x="11.6" y="7" width="1.9" height="16.5" rx="0.6" />
      <rect x="23.6" y="4" width="1.9" height="16.5" rx="0.6" />

      <path d="M11.6 7h13.9v3.4H11.6z" />
      <path d="M11.6 11.2h13.9v1.7H11.6z" />
    </svg>
  )
}
