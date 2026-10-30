import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { videos, type VideoItem } from '../../data/media'
import { r2Url } from '../../lib/r2'
import { revealVideoPosterFrame } from '../../lib/videoThumbnail'
import { Phrase } from '../motion/Phrase'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function StagePlayer({
  video,
  src,
  onClose,
}: {
  video: VideoItem
  src: string
  onClose: () => void
}) {
  const shellRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const closingRef = useRef(false)
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [ratio, setRatio] = useState(16 / 9)
  const [controlsVisible, setControlsVisible] = useState(true)
  const hideTimer = useRef<number | null>(null)

  const syncMetrics = () => {
    const el = videoRef.current
    if (!el) return
    setProgress(el.currentTime)
    if (el.duration && Number.isFinite(el.duration)) setDuration(el.duration)
    if (el.videoWidth > 0 && el.videoHeight > 0) {
      setRatio(el.videoWidth / el.videoHeight)
    }
  }

  const bumpControls = useCallback(() => {
    setControlsVisible(true)
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => {
      if (!videoRef.current?.paused) setControlsVisible(false)
    }, 2400)
  }, [])

  useEffect(() => {
    closingRef.current = false
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    bumpControls()
    const shell = shellRef.current
    const enter =
      shell?.requestFullscreen?.() ??
      (
        shell as HTMLDivElement & {
          webkitRequestFullscreen?: () => Promise<void> | void
        }
      )?.webkitRequestFullscreen?.()
    void Promise.resolve(enter).catch(() => {})
    return () => {
      closingRef.current = true
      document.body.style.overflow = prev
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
      if (document.fullscreenElement) {
        void document.exitFullscreen().catch(() => {})
      }
    }
  }, [bumpControls])

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      const el = videoRef.current
      if (!el) return
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault()
        if (el.paused) void el.play()
        else el.pause()
        bumpControls()
      }
      if (e.key === 'ArrowRight') {
        el.currentTime = Math.min(el.duration || 0, el.currentTime + 5)
        bumpControls()
      }
      if (e.key === 'ArrowLeft') {
        el.currentTime = Math.max(0, el.currentTime - 5)
        bumpControls()
      }
    }
    const onFullscreen = () => {
      if (!closingRef.current && !document.fullscreenElement) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('fullscreenchange', onFullscreen)
    }
  }, [bumpControls, onClose])

  const togglePlay = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) void el.play()
    else el.pause()
    bumpControls()
  }

  return (
    <motion.div
      ref={shellRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050304] p-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.24, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${video.title}`}
      onPointerMove={bumpControls}
    >
      <motion.div
        className="stage-aperture"
        style={{ ['--stage-ratio' as string]: String(ratio) }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.24, 1] }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain bg-black"
          src={src}
          autoPlay
          playsInline
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={onClose}
          onTimeUpdate={syncMetrics}
          onLoadedMetadata={syncMetrics}
          onClick={togglePlay}
        />

        <div
          className={`absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 bg-gradient-to-b from-black/80 via-black/35 to-transparent px-5 pt-5 pb-16 transition-opacity duration-300 sm:px-8 sm:pt-7 ${
            controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="min-w-0">
            <p className="label-movement text-gold">Live stage</p>
            <h3 className="mt-1 truncate font-display text-2xl font-bold text-ivory md:text-3xl">
              {video.title}
            </h3>
            {video.subtitle ? (
              <p className="mt-1 truncate text-sm text-dust">{video.subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 shrink-0 items-center justify-center border border-gold/40 bg-velvet/40 text-gold backdrop-blur-sm transition-colors hover:border-gold hover:bg-gold/10"
            aria-label="Close player"
          >
            ✕
          </button>
        </div>

        <div
          className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-5 pt-20 pb-5 transition-opacity duration-300 sm:px-8 sm:pb-6 ${
            controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="mb-3 flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/55 bg-velvet/55 text-gold backdrop-blur-sm transition-colors hover:border-gold hover:bg-gold/15"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 5h3v14H7zm7 0h3v14h-3z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <p className="min-w-[6.5rem] text-sm tracking-wide text-ivory/85 tabular-nums">
              {formatTime(progress)} / {formatTime(duration)}
            </p>
            <p className="ml-auto hidden text-[0.6875rem] tracking-[0.18em] text-dust uppercase sm:block">
              Esc · Space
            </p>
          </div>
          <input
            type="range"
            className="stage-scrub"
            min={0}
            max={duration || 0}
            step={0.05}
            value={progress}
            aria-label="Seek"
            onChange={(e) => {
              const next = Number(e.target.value)
              const el = videoRef.current
              if (!el) return
              el.currentTime = next
              setProgress(next)
              bumpControls()
            }}
            style={{
              background: `linear-gradient(to right, var(--color-gold) 0%, var(--color-gold) ${
                duration ? (progress / duration) * 100 : 0
              }%, color-mix(in srgb, var(--color-line-soft) 80%, transparent) ${
                duration ? (progress / duration) * 100 : 0
              }%, color-mix(in srgb, var(--color-line-soft) 80%, transparent) 100%)`,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

function VideoPlate({
  video,
  onPlay,
}: {
  video: VideoItem
  onPlay: (video: VideoItem, src: string) => void
}) {
  const [frameReady, setFrameReady] = useState(false)
  const [broken, setBroken] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const blurRef = useRef<HTMLVideoElement>(null)
  const src = r2Url(video.videoKey)
  const canPlay = Boolean(src) && !broken

  useEffect(() => {
    const el = videoRef.current
    const blur = blurRef.current
    if (!el || !src) return

    setFrameReady(false)
    setBroken(false)

    const mainJob = revealVideoPosterFrame(el)
    const blurJob = blur ? revealVideoPosterFrame(blur) : undefined

    void Promise.allSettled([
      mainJob.promise,
      blurJob?.promise ?? Promise.resolve(),
    ]).then((results) => {
      if (results[0].status === 'rejected') {
        setBroken(true)
        return
      }
      setFrameReady(true)
    })

    return () => {
      mainJob.cancel()
      blurJob?.cancel()
    }
  }, [src])

  return (
    <article className="group w-[min(88vw,26rem)] snap-start sm:w-[min(70vw,28rem)]">
      <div className="film-plate relative aspect-video bg-velvet-soft">
        {src ? (
          <>
            <video
              ref={blurRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-80 blur-lg saturate-125"
              src={src}
              muted
              playsInline
              preload="metadata"
            />
            <video
              ref={videoRef}
              className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-contain transition duration-700 group-hover:scale-[1.02]"
              src={src}
              muted
              playsInline
              preload="metadata"
              onError={() => setBroken(true)}
            />
          </>
        ) : null}

        <button
          type="button"
          onClick={() => {
            if (src && canPlay) onPlay(video, src)
          }}
          disabled={!canPlay}
          className="absolute inset-0 z-[2] w-full disabled:cursor-default"
          aria-label={canPlay ? `Play ${video.title}` : video.title}
        >
          {!frameReady && (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,rgba(28,20,23,0.8),rgba(10,7,8,0.9))]">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.12),transparent_65%)]"
              />
            </div>
          )}
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full border bg-velvet/50 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 ${
                canPlay ? 'border-gold/50 text-gold' : 'border-line text-dust'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            {!canPlay && (
              <span className="text-[0.6875rem] tracking-[0.22em] uppercase text-dust">
                Soon
              </span>
            )}
          </span>
        </button>
      </div>
      <p className="mt-4 text-[0.9375rem] leading-snug text-ivory">
        <span className="font-medium">{video.title}</span>
        {video.subtitle ? (
          <span className="mt-1 block text-[0.875rem] text-dust">
            {video.subtitle}
          </span>
        ) : null}
      </p>
    </article>
  )
}

export function ScoreScroll() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [_videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [active, setActive] = useState<{ video: VideoItem; src: string } | null>(
    null,
  )
  const dragging = useRef(false)
  const moved = useRef(false)
  const startX = useRef(0)
  const scrollStart = useRef(0)

  useEffect(() => {
    setLoading(true)
    setVideos(videos)
    setLoading(false)
  }, [])

  const getStep = () => {
    const el = scrollerRef.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!card) return 0
    return card.offsetWidth + 24
  }

  const updateIndex = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const step = getStep()
    if (!step) return
    setIndex((prev) => {
      const next = Math.min(
        Math.max(_videos.length - 1, 0),
        Math.max(0, Math.round(el.scrollLeft / step)),
      )
      return next === prev ? prev : next
    })
  }, [_videos.length])

  const goTo = (i: number) => {
    const el = scrollerRef.current
    if (!el || _videos.length === 0) return
    const next = Math.min(_videos.length - 1, Math.max(0, i))
    el.scrollTo({ left: next * getStep(), behavior: 'smooth' })
    setIndex(next)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a, video, input')) return
    const el = scrollerRef.current
    if (!el) return
    dragging.current = true
    moved.current = false
    startX.current = e.clientX
    scrollStart.current = el.scrollLeft
    el.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !scrollerRef.current) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 6) moved.current = true
    scrollerRef.current.scrollLeft = scrollStart.current - dx
    updateIndex()
  }

  const onPointerUp = () => {
    dragging.current = false
    updateIndex()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      goTo(index + 1)
      e.preventDefault()
    }
    if (e.key === 'ArrowLeft') {
      goTo(index - 1)
      e.preventDefault()
    }
  }

  const measure = String(Math.min(index + 1, Math.max(_videos.length, 1))).padStart(
    2,
    '0',
  )
  const total = String(Math.max(_videos.length, 0)).padStart(2, '0')

  return (
    <div>
      <Phrase>
        <p className="label-movement text-center text-gold">Film</p>
        <h2 className="mt-3 text-center font-display text-3xl font-bold text-ivory md:text-4xl">
          Performance
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[0.9375rem] leading-relaxed text-dust">
          Drag, swipe, or use the arrows to move through the reel.
        </p>
      </Phrase>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm font-medium tracking-wide text-gold/80" aria-live="polite">
          {loading ? '…' : `${measure} / ${total}`}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={loading || index <= 0}
            className="flex h-11 w-11 items-center justify-center border border-line text-gold transition-colors hover:border-gold disabled:opacity-30"
            aria-label="Previous video"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={loading || index >= _videos.length - 1}
            className="flex h-11 w-11 items-center justify-center border border-line text-gold transition-colors hover:border-gold disabled:opacity-30"
            aria-label="Next video"
          >
            →
          </button>
        </div>
      </div>

      {loading ? (
        <div
          className="mt-6 flex h-[min(50vw,16rem)] items-center justify-center border border-line/40 text-sm tracking-wide text-dust uppercase"
          aria-busy="true"
        >
          Loading reel…
        </div>
      ) : _videos.length === 0 ? (
        <div className="mt-6 flex h-[min(50vw,16rem)] items-center justify-center border border-line/40 px-6 text-center text-sm tracking-wide text-dust">
          No performances in the reel yet.
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="score-scroll mt-6 outline-none"
          tabIndex={0}
          role="region"
          aria-label="Performance videos"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onScroll={updateIndex}
          onKeyDown={onKeyDown}
        >
          {_videos.map((video) => (
            <VideoPlate
              key={video.id}
              video={video}
              onPlay={(item, src) => setActive({ video: item, src })}
            />
          ))}
        </div>
      )}

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {active ? (
                <StagePlayer
                  key={active.video.id}
                  video={active.video}
                  src={active.src}
                  onClose={() => setActive(null)}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  )
}
