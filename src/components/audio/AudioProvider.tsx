import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

const FFT = 256

type AudioContextValue = {
  audioEl: HTMLAudioElement | null
  analyser: AnalyserNode | null
  playing: boolean
  currentSrc: string | null
  currentTitle: string | null
  play: (src: string, title?: string) => void
  pause: () => void
  toggle: (src: string, title?: string) => void
  /** Seek to a 0–1 position in the current track (loads src if provided). */
  seek: (ratio: number, src?: string, title?: string) => void
}

const AudioCtx = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [playing, setPlaying] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string | null>(null)
  const [currentTitle, setCurrentTitle] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = new Audio()
    el.crossOrigin = 'anonymous'
    el.preload = 'metadata'
    audioRef.current = el

    const onEnded = () => setPlaying(false)
    const onPause = () => setPlaying(false)
    const onPlay = () => setPlaying(true)

    el.addEventListener('ended', onEnded)
    el.addEventListener('pause', onPause)
    el.addEventListener('play', onPlay)

    try {
      const ctx = new AudioContext()
      const source = ctx.createMediaElementSource(el)
      const node = ctx.createAnalyser()
      node.fftSize = FFT
      node.smoothingTimeConstant = 0.82
      source.connect(node)
      node.connect(ctx.destination)
      audioCtxRef.current = ctx
      setAnalyser(node)
    } catch {
      audioCtxRef.current = null
      setAnalyser(null)
    }

    setReady(true)

    return () => {
      el.pause()
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('play', onPlay)
      audioRef.current = null
      setAnalyser(null)
      const ctx = audioCtxRef.current
      audioCtxRef.current = null
      if (ctx) void ctx.close()
    }
  }, [])

  const resumeCtx = useCallback(() => {
    const ctx = audioCtxRef.current
    if (ctx?.state === 'suspended') void ctx.resume()
  }, [])

  const sameSrc = useCallback((el: HTMLAudioElement, src: string) => {
    if (!el.src) return false
    if (el.src === src) return true
    try {
      return new URL(src, window.location.href).href === el.src
    } catch {
      return false
    }
  }, [])

  const play = useCallback(
    (src: string, title?: string) => {
      const el = audioRef.current
      if (!el) return
      if (!sameSrc(el, src)) {
        el.src = src
        setCurrentSrc(src)
        setCurrentTitle(title ?? null)
      }
      resumeCtx()
      void el.play().catch(() => setPlaying(false))
    },
    [resumeCtx, sameSrc],
  )

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(
    (src: string, title?: string) => {
      const el = audioRef.current
      if (!el) return
      if (currentSrc === src && playing) {
        el.pause()
        return
      }
      play(src, title)
    },
    [currentSrc, playing, play],
  )

  const seek = useCallback(
    (ratio: number, src?: string, title?: string) => {
      const el = audioRef.current
      if (!el) return
      const nextSrc = src ?? currentSrc
      if (!nextSrc) return

      const apply = () => {
        if (!Number.isFinite(el.duration) || el.duration <= 0) return
        const t = Math.max(0, Math.min(1, ratio)) * el.duration
        el.currentTime = t
      }

      if (!sameSrc(el, nextSrc)) {
        el.src = nextSrc
        setCurrentSrc(nextSrc)
        setCurrentTitle(title ?? null)
        const onMeta = () => {
          el.removeEventListener('loadedmetadata', onMeta)
          apply()
          resumeCtx()
          void el.play().catch(() => setPlaying(false))
        }
        el.addEventListener('loadedmetadata', onMeta)
        el.load()
        return
      }

      apply()
    },
    [currentSrc, resumeCtx, sameSrc],
  )

  const value = useMemo(
    () => ({
      audioEl: audioRef.current,
      analyser,
      playing,
      currentSrc,
      currentTitle,
      play,
      pause,
      toggle,
      seek,
    }),
    [analyser, playing, currentSrc, currentTitle, play, pause, toggle, seek, ready],
  )

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>
}

export function useAudioPlayer() {
  const ctx = useContext(AudioCtx)
  if (!ctx) {
    throw new Error('useAudioPlayer must be used within AudioProvider')
  }
  return ctx
}
