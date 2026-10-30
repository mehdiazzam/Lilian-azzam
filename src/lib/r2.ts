const R2_BASE = (import.meta.env.VITE_R2_PUBLIC_URL as string | undefined)?.replace(
  /\/$/,
  '',
)

export function r2Url(keyOrUrl?: string): string | undefined {
  if (!keyOrUrl) return undefined
  if (/^https?:\/\//i.test(keyOrUrl)) return keyOrUrl
  if (keyOrUrl.startsWith('/')) return keyOrUrl
  if (!R2_BASE) return undefined
  const key = keyOrUrl.replace(/^\//, '')
  return `${R2_BASE}/${key}`
}

export function hasR2Config(): boolean {
  return Boolean(R2_BASE)
}

export const r2BaseUrl = R2_BASE
