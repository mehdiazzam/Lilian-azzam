import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { soundBites, type AudioTrack } from '../../data/audio'
import { r2Url } from '../../lib/r2'
import { useAudioPlayer } from '../audio/AudioProvider'
import { Phrase } from '../motion/Phrase'

function TrackRow({
  track,
  active,
  playing,
  onSelect,
  available,
}: {
  track: AudioTrack
  active: boolean
  playing: boolean
  onSelect: () => void
  available: boolean
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!available}
      aria-pressed={active && playing}
      className={`flex w-full min-h-[4.25rem] items-center gap-4 border-b border-line-soft px-2 py-4 text-left transition-colors disabled:cursor-not-allowed ${
        active ? 'bg-gold/5 text-ivory' : 'text-dust hover:bg-velvet-soft/80 hover:text-ivory'
      } ${!available ? 'opacity-55' : ''}`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
          active ? 'border-gold bg-gold/15 text-gold' : 'border-line'
        }`}
        aria-hidden
      >
        {playing && active ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[1.125rem] font-medium text-inherit">
          {track.title}
        </span>
        <span className="mt-0.5 block text-[0.9375rem] text-dust">
          {track.composer}
          {track.work ? ` · ${track.work}` : ''}
          {!available ? ' · Recording soon' : ''}
        </span>
      </span>
      {available && track.durationLabel !== '—:—' ? (
        <span className="shrink-0 text-sm tabular-nums text-dust">
          {track.durationLabel}
        </span>
      ) : null}
    </button>
  )
}

export function SoundBites() {
  const { toggle, playing, currentSrc, currentTitle, pause } = useAudioPlayer()
  const anyReady = soundBites.some((track) => Boolean(r2Url(track.audioKey)))

  const selectTrack = (track: AudioTrack) => {
    const src = r2Url(track.audioKey)
    if (!src) return
    toggle(src, track.title)
  }

  return (
    <section
      id="sound-bites"
      className="panel relative scroll-mt-24 px-[var(--spacing-gutter)] py-[var(--spacing-section)]"
    >
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Phrase beat={0}>
          <p className="label-movement text-gold">Sound bites</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ivory md:text-4xl">
            A first hearing
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-dust">
            Three arias selected for casting — clarity of line, colour, and
            dramatic intent.
            {!anyReady && (
              <> Tracks will stream here once the recordings are published.</>
            )}
          </p>

          <div className="mt-8" role="list">
            {soundBites.map((track) => {
              const src = r2Url(track.audioKey)
              return (
                <div key={track.id} role="listitem">
                  <TrackRow
                    track={track}
                    active={currentSrc === src}
                    playing={playing && currentSrc === src}
                    available={Boolean(src)}
                    onSelect={() => selectTrack(track)}
                  />
                </div>
              )
            })}
          </div>

          <AnimatePresence>
            {playing && currentTitle && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-6 flex items-center justify-between gap-4 border border-gold/25 bg-velvet-raised px-4 py-3"
              >
                <p className="min-w-0 truncate text-sm font-medium text-gold">
                  Now playing — {currentTitle}
                </p>
                <button
                  type="button"
                  onClick={pause}
                  className="shrink-0 text-xs tracking-wide text-dust uppercase transition-colors hover:text-ivory"
                >
                  Pause
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Phrase>

        <Phrase beat={2}>
          <p className="label-movement text-gold">Portrait</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ivory md:text-4xl">
            In a breath
          </h2>
          <motion.div
            className="mt-8 space-y-5 text-lg leading-relaxed text-ivory/90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7 }}
          >
            <p>
              Lilian Azzam is a lyric soprano shaped by Mozart and Italian bel
              canto, with a particular closeness to German Lied and sacred
              concert repertoire.
            </p>
            <p>
              Formed at the Higher Institute of Music, she sings with clear
              line and stage presence — as natural on the opera stage as in
              the recital hall.
            </p>
            <p>
              Open for opera, oratorio, and recital. Press materials and a
              full biography are a click away.
            </p>
          </motion.div>

          <div className="mt-10">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-gold-foil px-7 py-3.5 text-sm font-semibold tracking-wide text-velvet no-underline transition-opacity hover:opacity-90"
            >
              Contact Me
            </Link>
          </div>
        </Phrase>
      </div>
    </section>
  )
}
