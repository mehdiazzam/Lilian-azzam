import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { OperaIcon } from './OperaIcon'

const movements = [
  {
    to: '/',
    label: 'Preludio',
    plain: 'Stage',
    roman: 'I',
    end: true,
  },
  {
    to: '/about',
    label: 'Aria',
    plain: 'Biography',
    roman: 'II',
    end: false,
  },
  {
    to: '/media',
    label: 'Intermezzo',
    plain: 'Gallery',
    roman: 'III',
    end: false,
  },
  {
    to: '/contact',
    label: 'Coda',
    plain: 'Inquire',
    roman: 'IV',
    end: false,
  },
] as const

function activeMovement(pathname: string) {
  return (
    movements.find((m) =>
      m.end ? pathname === m.to : pathname.startsWith(m.to),
    ) ?? movements[0]
  )
}

export function MovementNav() {
  const location = useLocation()
  const current = activeMovement(location.pathname)

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:bg-gold focus:px-4 focus:py-2 focus:text-velvet"
      >
        Skip to content
      </a>

      {/* Desktop — left movement rail */}
      <aside
        className="fixed top-0 left-0 z-50 hidden h-full w-[var(--spacing-rail)] flex-col items-stretch border-r border-line-soft bg-velvet/40 py-6 backdrop-blur-sm lg:flex"
        aria-label="Site navigation"
      >
        <Link
          to="/"
          className="mx-auto text-gold no-underline transition-opacity hover:opacity-80"
          aria-label="Lilian Azzam — home"
        >
          <OperaIcon />
        </Link>

        <nav className="mt-10 flex flex-1 flex-col justify-center gap-1 px-2 pb-6">
          {movements.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.end}
              title={`${m.roman}. ${m.label} — ${m.plain}`}
              className={({ isActive }) =>
                `group relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-sm px-1 py-2 no-underline transition-colors ${
                  isActive
                    ? 'bg-gold/10 text-gold'
                    : 'text-dust hover:bg-velvet-soft hover:text-ivory'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="movement-caret"
                      className="absolute top-1/2 left-0 h-6 w-0.5 -translate-y-1/2 bg-gold"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="text-[0.7rem] font-medium tracking-[0.14em] uppercase">
                    {m.roman}
                  </span>
                  <span className="text-[0.8rem] font-medium leading-tight tracking-wide">
                    {m.label}
                  </span>
                  <span className="text-[0.65rem] font-normal tracking-wide text-dust">
                    {m.plain}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile — brand only (no menu toggle) */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-center border-b border-line bg-velvet/95 px-[var(--spacing-gutter)] py-3.5 backdrop-blur-md lg:hidden">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-gold no-underline"
          aria-label="Lilian Azzam — home"
        >
          <OperaIcon width={22} height={22} />
          <span className="font-display text-lg font-bold text-ivory">
            Lilian Azzam
          </span>
        </Link>
      </header>

      {/* Mobile — score-measure dial (always visible, no burger/overlay) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
        aria-label="Movements"
      >
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-[linear-gradient(to_top,rgba(10,7,8,0.85),transparent)]" />

        <div className="border-t border-gold/25 bg-[linear-gradient(180deg,#1A1014_0%,#0A0708_100%)] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md">
          {/* Active movement cue */}
          <p
            className="mb-1.5 text-center font-display text-[0.7rem] tracking-[0.28em] text-gold/70 uppercase"
            aria-live="polite"
          >
            <span className="text-gold">{current.roman}</span>
            <span className="mx-2 text-gold/30">·</span>
            {current.label}
            <span className="mx-2 text-gold/30">·</span>
            {current.plain}
          </p>

          {/* Staff line */}
          <div className="relative mx-1 mb-1 h-px bg-gold/20" aria-hidden>
            <span className="absolute top-1/2 left-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gold/50" />
            <span className="absolute top-1/2 right-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gold/50" />
          </div>

          <div className="grid grid-cols-4 gap-0.5">
            {movements.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                end={m.end}
                className={({ isActive }) =>
                  `relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-sm no-underline transition-colors ${
                    isActive ? 'text-gold' : 'text-dust active:text-ivory'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="score-measure-glow"
                        className="absolute inset-x-1 inset-y-1 rounded-sm bg-gold/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                    <span className="relative font-display text-xl font-bold leading-none tracking-wide">
                      {m.roman}
                    </span>
                    <span className="relative text-[0.6rem] font-medium tracking-[0.14em] uppercase">
                      {m.plain}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="score-measure-bar"
                        className="absolute bottom-1 h-0.5 w-5 bg-gold"
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
