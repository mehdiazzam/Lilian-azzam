import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { photos } from '../../data/media'
import { r2Url } from '../../lib/r2'
import { Phrase } from '../motion/Phrase'

const aspectClass = {
  tall: 'aspect-[3/4] min-h-[16rem]',
  wide: 'aspect-[16/10] min-h-[12rem]',
  square: 'aspect-square min-h-[14rem]',
}

const available = photos
  .map((photo) => ({ ...photo, src: r2Url(photo.imageKey) }))
  .filter((photo) => Boolean(photo.src))

export function PhotoMasonry() {
  const [openId, setOpenId] = useState<string | null>(null)
  const openIndex = available.findIndex((photo) => photo.id === openId)
  const open = openIndex >= 0 ? available[openIndex] : null

  const step = useCallback(
    (delta: number) => {
      if (openIndex < 0) return
      const next = (openIndex + delta + available.length) % available.length
      setOpenId(available[next].id)
    },
    [openIndex],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, step])

  const lightbox =
    typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[100] flex flex-col bg-velvet/97"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                role="dialog"
                aria-modal="true"
                aria-label={open.label}
              >
                <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
                  <p className="min-w-0 truncate pr-3 text-[0.9375rem] text-dust">
                    {open.label}
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpenId(null)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-gold"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div
                  className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-2"
                  onClick={() => setOpenId(null)}
                >
                  <motion.img
                    key={open.id}
                    src={open.src}
                    alt={open.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="max-h-full max-w-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="flex items-center justify-center gap-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="flex h-11 w-11 items-center justify-center border border-line text-gold"
                    aria-label="Previous photo"
                  >
                    ←
                  </button>
                  <p className="min-w-[4.5rem] text-center text-sm text-gold/80">
                    {String(openIndex + 1).padStart(2, '0')} /{' '}
                    {String(available.length).padStart(2, '0')}
                  </p>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="flex h-11 w-11 items-center justify-center border border-line text-gold"
                    aria-label="Next photo"
                  >
                    →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )
      : null

  return (
    <div>
      <Phrase>
        <p className="label-movement text-center text-gold">Stills</p>
        <h2 className="mt-3 text-center font-display text-3xl font-bold text-ivory md:text-4xl">
          In the light
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[0.9375rem] leading-relaxed text-dust">
          Production and portrait photography from stage and studio. Select an
          image to enlarge.
        </p>
      </Phrase>

      <Phrase beat={1} className="masonry mt-8">
        {photos.map((photo) => {
          const src = r2Url(photo.imageKey)
          const frame = (
            <>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 border border-gold/20 transition-colors group-hover:border-gold/50"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,rgba(242,200,121,0.12),transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100"
              />
            </>
          )

          if (!src) {
            return (
              <div
                key={photo.id}
                className={`${aspectClass[photo.aspect]} group relative overflow-hidden bg-velvet-soft/70`}
              >
                {frame}
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[linear-gradient(160deg,rgba(28,20,23,0.8),rgba(10,7,8,0.9))] p-4">
                  <span className="text-xs tracking-[0.2em] uppercase text-gold/40">
                    Photo
                  </span>
                  <span className="text-center text-[0.9375rem] text-dust/50">
                    {photo.label}
                  </span>
                </div>
              </div>
            )
          }

          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => setOpenId(photo.id)}
              className={`${aspectClass[photo.aspect]} group relative block w-full overflow-hidden bg-velvet-soft/70`}
              aria-label={`Enlarge ${photo.label}`}
            >
              {frame}
              <img
                src={src}
                alt={photo.label}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </button>
          )
        })}
      </Phrase>

      {lightbox}
    </div>
  )
}
