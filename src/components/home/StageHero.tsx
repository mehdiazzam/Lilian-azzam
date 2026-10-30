import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { soundBites } from '../../data/audio'
import { heroPosterKey, heroVideoKey } from '../../data/media'
import { extractAudioWaveform } from '../../lib/audioWaveform'
import { r2Url } from '../../lib/r2'
import { useAudioAnalyser } from '../audio/useAudioAnalyser'

function WaveformCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { playingRef, audioElRef, currentSrcRef, seek } = useAudioAnalyser()
  const reduce = useReducedMotion()
  const scrubbingRef = useRef(false)
  const seekRef = useRef(seek)
  seekRef.current = seek

  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const BARS = 160
    let peaks: Float32Array | null = null
    let raf = 0
    let lastW = 0
    let lastH = 0
    let lastSrc: string | null = null
    let smoothProgress = 0
    let smoothPlayheadX = 0
    let playheadReady = false
    let loadedUrl: string | null = null
    let cancelled = false

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

    const mixRgba = (
      a: [number, number, number, number],
      b: [number, number, number, number],
      t: number,
    ) => {
      const u = clamp01(t)
      return `rgba(${Math.round(lerp(a[0], b[0], u))},${Math.round(
        lerp(a[1], b[1], u),
      )},${Math.round(lerp(a[2], b[2], u))},${lerp(a[3], b[3], u).toFixed(3)})`
    }

    const muted: [number, number, number, number] = [184, 174, 162, 0.28]
    const goldSoft: [number, number, number, number] = [242, 200, 121, 0.95]
    const goldDeep: [number, number, number, number] = [201, 162, 39, 0.95]

    const ensureWaveform = (url: string | null) => {
      if (!url || url === loadedUrl) return
      loadedUrl = url
      void extractAudioWaveform(url, BARS)
        .then((next) => {
          if (!cancelled && loadedUrl === url) peaks = next
        })
        .catch(() => {
          if (!cancelled && loadedUrl === url) peaks = null
        })
    }

    const ratioFromEvent = (clientX: number) => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width) return 0
      return clamp01((clientX - rect.left) / rect.width)
    }

    const scrubTo = (clientX: number) => {
      const ratio = ratioFromEvent(clientX)
      const fallback = soundBites[0]
      const src = currentSrcRef.current || r2Url(fallback?.audioKey)
      if (!src) return
      smoothProgress = ratio
      smoothPlayheadX = ratio * (lastW || canvas.clientWidth)
      playheadReady = true
      seekRef.current(ratio, src, fallback?.title)
      canvas.setAttribute('aria-valuenow', String(Math.round(ratio * 100)))
    }

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      scrubbingRef.current = true
      canvas.setPointerCapture(e.pointerId)
      scrubTo(e.clientX)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!scrubbingRef.current) return
      e.preventDefault()
      scrubTo(e.clientX)
    }
    const onPointerUp = (e: PointerEvent) => {
      if (!scrubbingRef.current) return
      scrubbingRef.current = false
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {
        /* already released */
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return false
      if (w === lastW && h === lastH) return true
      lastW = w
      lastH = h
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      playheadReady = false
      return true
    }

    const draw = () => {
      if (!resize()) {
        raf = requestAnimationFrame(draw)
        return
      }

      const w = lastW
      const h = lastH
      const isPlaying = playingRef.current
      const audio = audioElRef.current
      const src = currentSrcRef.current
      const fallback = r2Url(soundBites[0]?.audioKey) ?? null
      ensureWaveform(src || fallback)

      if (src !== lastSrc) {
        lastSrc = src
        if (!scrubbingRef.current) {
          smoothProgress = 0
          playheadReady = false
        }
      }

      const duration =
        audio && Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : 0
      const currentTime = audio ? audio.currentTime : 0
      const targetProgress =
        duration > 0 && (src || scrubbingRef.current)
          ? clamp01(currentTime / duration)
          : 0

      if (!scrubbingRef.current) {
        const progressDelta = Math.abs(targetProgress - smoothProgress)
        const ease = isPlaying
          ? progressDelta > 0.04
            ? 0.35
            : 0.16
          : progressDelta > 0.04
            ? 0.45
            : 0.22
        smoothProgress = lerp(smoothProgress, targetProgress, ease)
        if (!isPlaying && currentTime < 0.05) {
          smoothProgress = lerp(smoothProgress, 0, 0.25)
        }
      }

      const playhead = smoothProgress * BARS

      ctx.clearRect(0, 0, w, h)

      const mid = h * 0.5
      const gap = Math.max(1, w / BARS > 5 ? 1.5 : 1)
      const barW = Math.max(1.25, w / BARS - gap)
      const maxH = h * 0.44
      const stride = barW + gap

      ctx.fillStyle = 'rgba(28,20,23,0.35)'
      ctx.fillRect(0, mid - maxH - 4, w, maxH * 2 + 8)

      for (let i = 0; i < BARS; i++) {
        const amp = peaks?.[i] ?? 0.08
        const barH = Math.max(2.5, amp * maxH)
        const x = i * stride

        const fill = clamp01(playhead - i)
        const edge = fill < 1 ? fill * fill * (3 - 2 * fill) : 1
        const tone = mixRgba(muted, goldSoft, edge)
        const deep = mixRgba(muted, goldDeep, edge)

        if (edge > 0.02) {
          const g = ctx.createLinearGradient(0, mid - barH, 0, mid + barH)
          g.addColorStop(0, tone)
          g.addColorStop(0.5, deep)
          g.addColorStop(1, tone)
          ctx.fillStyle = g
        } else {
          ctx.fillStyle = 'rgba(184,174,162,0.28)'
        }

        const r = Math.min(barW / 2, 1.75)
        const top = mid - barH
        const bot = mid + barH * 0.72
        ctx.beginPath()
        ctx.moveTo(x + r, top)
        ctx.arcTo(x + barW, top, x + barW, top + r, r)
        ctx.lineTo(x + barW, bot - r)
        ctx.arcTo(x + barW, bot, x + barW - r, bot, r)
        ctx.lineTo(x + r, bot)
        ctx.arcTo(x, bot, x, bot - r, r)
        ctx.lineTo(x, top + r)
        ctx.arcTo(x, top, x + r, top, r)
        ctx.closePath()
        ctx.fill()
      }

      const showHead =
        scrubbingRef.current ||
        (duration > 0 &&
          (src || fallback) &&
          (isPlaying || currentTime > 0.05 || smoothProgress > 0.001))

      if (showHead) {
        const targetX = Math.min(w - 1, smoothProgress * w)
        if (scrubbingRef.current || !playheadReady) {
          smoothPlayheadX = targetX
          playheadReady = true
        } else {
          smoothPlayheadX = lerp(smoothPlayheadX, targetX, isPlaying ? 0.2 : 0.3)
        }

        const glow = ctx.createLinearGradient(
          0,
          mid - maxH - 8,
          0,
          mid + maxH * 0.72 + 8,
        )
        glow.addColorStop(0, 'rgba(242,200,121,0)')
        glow.addColorStop(0.5, 'rgba(242,200,121,0.35)')
        glow.addColorStop(1, 'rgba(242,200,121,0)')
        ctx.fillStyle = glow
        ctx.fillRect(smoothPlayheadX - 6, mid - maxH - 8, 12, maxH + maxH * 0.72 + 16)

        ctx.fillStyle = 'rgba(244,239,230,0.92)'
        ctx.fillRect(
          smoothPlayheadX,
          mid - maxH - 6,
          1.5,
          maxH + maxH * 0.72 + 12,
        )
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
    }
  }, [reduce, playingRef, audioElRef, currentSrcRef])

  if (reduce) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-x-0 bottom-0 z-[1] h-[22%] w-full cursor-ew-resize touch-none opacity-90"
      role="slider"
      aria-label="Seek audio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      tabIndex={0}
    />
  )
}

export function StageHero() {
  const src = r2Url(heroVideoKey)
  const poster = r2Url(heroPosterKey)

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {src ? (
          <video
            className="h-full w-full object-cover opacity-40"
            autoPlay
            muted
            loop
            playsInline
            poster={poster}
            aria-hidden
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : poster ? (
          <div
            className="h-full w-full bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${poster})` }}
            aria-hidden
          />
        ) : null}

        {(src || poster) && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_0%,#0A0708_72%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-velvet via-velvet/40 to-velvet/30"
            />
          </>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(242,200,121,0.09),transparent_55%)]"
        />

        <WaveformCanvas />
      </div>

      <div className="stage-spot pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-[var(--spacing-gutter)] py-28 text-center">
        <motion.p
          className="label-movement relative z-10 mb-5 text-gold"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.24, 1] }}
        >
          I. Preludio
        </motion.p>

        <motion.h1
          className="relative z-10 font-display text-[clamp(3.5rem,12vw,8rem)] leading-[0.92] font-black tracking-tight text-ivory"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, delay: 0.22, ease: [0.16, 1, 0.24, 1] }}
        >
          Lilian
          <br />
          <span className="text-gold-foil italic">Azzam</span>
        </motion.h1>

        <motion.p
          className="relative z-10 mt-6 text-xl font-medium tracking-wide text-dust md:text-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.45 }}
        >
          Lyric Soprano
        </motion.p>

        <motion.p
          className="relative z-10 mt-3 text-[0.8125rem] tracking-[0.18em] uppercase text-gold/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          Mozart · Bel canto · Art song
        </motion.p>

        <motion.div
          className="relative z-10 mt-12 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
        >
          <Link
            to="/contact"
            className="pointer-events-auto inline-flex items-center justify-center bg-gold-foil px-8 py-3.5 text-sm font-semibold tracking-wide text-velvet no-underline transition-opacity hover:opacity-90"
          >
            Contact Me
          </Link>
        </motion.div>
      </div>

    </section>
  )
}
