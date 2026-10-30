/**
 * Paint a still from the video itself and use that element as the thumbnail.
 * Canvas export is not used: the media host does not send CORS headers, so a
 * captured data URL would be blocked, while the video element can still show the frame.
 */

export function posterSeekTime(duration: number, atSeconds = 1): number {
  if (!Number.isFinite(duration) || duration <= 0) return 0.1
  const latest = Math.max(0.1, duration - 0.05)
  return Math.min(atSeconds, Math.max(0.1, duration * 0.1), latest)
}

export function revealVideoPosterFrame(
  video: HTMLVideoElement,
  options?: { atSeconds?: number; isCancelled?: () => boolean },
): { promise: Promise<void>; cancel: () => void } {
  const atSeconds = options?.atSeconds ?? 1
  const isCancelled = options?.isCancelled ?? (() => false)

  let settled = false
  let onMeta: (() => void) | undefined
  let onSeeked: (() => void) | undefined
  let onError: (() => void) | undefined

  const cleanup = () => {
    if (onMeta) video.removeEventListener('loadedmetadata', onMeta)
    if (onSeeked) video.removeEventListener('seeked', onSeeked)
    if (onError) video.removeEventListener('error', onError)
    onMeta = undefined
    onSeeked = undefined
    onError = undefined
  }

  const promise = new Promise<void>((resolve, reject) => {
    const finish = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve()
    }
    const fail = () => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error('Could not read a poster frame from the video'))
    }

    const onFail = () => fail()
    onError = onFail
    video.addEventListener('error', onError)

    const seek = () => {
      if (isCancelled()) {
        finish()
        return
      }
      const seekTo = posterSeekTime(video.duration, atSeconds)
      if (video.readyState >= 2 && Math.abs(video.currentTime - seekTo) < 0.05) {
        finish()
        return
      }
      onSeeked = () => finish()
      video.addEventListener('seeked', onSeeked)
      if (isCancelled()) {
        finish()
        return
      }
      try {
        video.currentTime = seekTo
      } catch {
        fail()
      }
    }

    if (video.readyState >= 1 && Number.isFinite(video.duration)) {
      seek()
      return
    }

    onMeta = () => seek()
    video.addEventListener('loadedmetadata', onMeta)
  })

  return {
    promise,
    cancel: () => {
      if (settled) return
      settled = true
      cleanup()
    },
  }
}
