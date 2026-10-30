import { PageHeader } from '../components/chrome/PageHeader'
import { ScoreScroll } from '../components/media/ScoreScroll'
import { PhotoMasonry } from '../components/media/PhotoMasonry'

export function MediaPage() {
  return (
    <div className="pt-20 lg:pt-12">
      <section className="px-[var(--spacing-gutter)] pt-[var(--spacing-section)] pb-8">
        <div className="mx-auto max-w-6xl">
          <PageHeader
            align="center"
            movement="III. Intermezzo"
            title="On stage"
            intro="Performance film and production stills — the voice in motion, and the face behind it."
          />
        </div>
      </section>

      <section className="px-[var(--spacing-gutter)] pb-[var(--spacing-section)]">
        <div className="mx-auto max-w-6xl">
          <ScoreScroll />
        </div>
      </section>

      <section className="panel px-[var(--spacing-gutter)] py-[var(--spacing-section)]">
        <div className="mx-auto max-w-6xl">
          <PhotoMasonry />
        </div>
      </section>
    </div>
  )
}
