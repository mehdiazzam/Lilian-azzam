const cache = new Map<string, Float32Array>()
const inflight = new Map<string, Promise<Float32Array>>()

function peaksFromBuffer(buffer: AudioBuffer, bars: number): Float32Array {
  const channel = buffer.getChannelData(0)
  const peaks = new Float32Array(bars)
  const block = Math.max(1, Math.floor(channel.length / bars))

  for (let i = 0; i < bars; i++) {
    const start = i * block
    const end = Math.min(channel.length, start + block)
    let peak = 0
    let sum = 0
    const count = end - start
    for (let s = start; s < end; s++) {
      const v = Math.abs(channel[s])
      peak = Math.max(peak, v)
      sum += v
    }
    const rms = count ? sum / count : 0
    // Blend peak + RMS so soft phrases still read
    peaks[i] = Math.min(1, peak * 0.72 + rms * 1.35)
  }

  // Light spatial smooth (keeps real shape, less jagged)
  for (let pass = 0; pass < 2; pass++) {
    const copy = Float32Array.from(peaks)
    for (let i = 1; i < bars - 1; i++) {
      peaks[i] = copy[i - 1] * 0.15 + copy[i] * 0.7 + copy[i + 1] * 0.15
    }
  }

  // Normalize so quiet tracks still fill the meter
  let max = 0
  for (let i = 0; i < bars; i++) max = Math.max(max, peaks[i])
  if (max > 0.001) {
    const gain = 0.92 / max
    for (let i = 0; i < bars; i++) {
      peaks[i] = Math.max(0.04, peaks[i] * gain)
    }
  }

  return peaks
}

/** Decode an audio URL into a fixed-length peak profile (SoundCloud-style). */
export async function extractAudioWaveform(
  url: string,
  bars = 160,
): Promise<Float32Array> {
  const key = `${url}::${bars}`
  const cached = cache.get(key)
  if (cached) return cached

  const pending = inflight.get(key)
  if (pending) return pending

  const job = (async () => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Waveform fetch failed (${res.status})`)
    const raw = await res.arrayBuffer()
    const ctx = new AudioContext()
    try {
      const decoded = await ctx.decodeAudioData(raw.slice(0))
      const peaks = peaksFromBuffer(decoded, bars)
      cache.set(key, peaks)
      return peaks
    } finally {
      void ctx.close()
    }
  })().finally(() => {
    inflight.delete(key)
  })

  inflight.set(key, job)
  return job
}
