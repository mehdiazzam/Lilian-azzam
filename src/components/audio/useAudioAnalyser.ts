import { useEffect, useRef } from 'react'
import { useAudioPlayer } from './AudioProvider'

/** Reads the shared Web Audio analyser owned by AudioProvider. */
export function useAudioAnalyser() {
  const { analyser, playing, audioEl, currentSrc, seek } = useAudioPlayer()
  const dataRef = useRef(new Uint8Array(64))
  const playingRef = useRef(playing)
  const audioElRef = useRef(audioEl)
  const currentSrcRef = useRef(currentSrc)
  playingRef.current = playing
  audioElRef.current = audioEl
  currentSrcRef.current = currentSrc

  useEffect(() => {
    if (!analyser) return
    dataRef.current = new Uint8Array(analyser.frequencyBinCount)
  }, [analyser])

  return {
    analyser,
    dataRef,
    playingRef,
    audioElRef,
    currentSrcRef,
    playing,
    seek,
  }
}
