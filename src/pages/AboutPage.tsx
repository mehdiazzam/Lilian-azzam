import { Phrase } from '../components/motion/Phrase'
import { PageHeader } from '../components/chrome/PageHeader'
import { ProgramRepertoire } from '../components/about/ProgramRepertoire'
import { WorkshopsResume } from '../components/about/WorkshopsResume'
import { r2Url } from '../lib/r2'

function Portrait({ src }: { src?: string }) {
  return (
    <figure className="relative overflow-hidden bg-velvet-raised">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-3 z-10 border border-gold/25 lg:inset-4"
      />
      {src ? (
        <img
          src={src}
          alt="Lilian Azzam performing outdoors"
          className="h-full w-full object-cover object-[center_18%]"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(180deg,rgba(28,20,23,0.85),rgba(10,7,8,0.9))]">
          <span className="label-movement text-gold/50">Portrait</span>
          <span className="text-[0.9375rem] text-dust/50">
            Studio photograph soon
          </span>
        </div>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_40%_15%,rgba(242,200,121,0.12),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-velvet/50 to-transparent lg:hidden"
      />
    </figure>
  )
}

export function AboutPage() {
  const headshot = r2Url(
    '/portfolio-img/photo_5859236300249042810_y.jpg',
  )

  return (
    <div className="pt-20 lg:pt-12">
      <section className="px-[var(--spacing-gutter)] py-[var(--spacing-section)]">
        <div className="mx-auto max-w-6xl">
          <PageHeader
            align="center"
            movement="II. Aria"
            title="The artist"
            intro="A lyric soprano for the opera house, the concert platform, and the intimate recital."
          />

          <div className="mt-8 grid items-start gap-8 lg:mt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <Phrase beat={1} className="order-1 lg:order-2">
              <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
                <div className="aspect-[5/6] sm:aspect-[4/5] lg:aspect-[3/4]">
                  <Portrait src={headshot} />
                </div>
                <p className="mt-3 text-center text-[0.75rem] tracking-[0.14em] text-dust uppercase lg:hidden">
                  Live performance
                </p>
              </div>
            </Phrase>

            <Phrase beat={2} className="order-2 lg:order-1">
              <div className="space-y-5 text-[1.0625rem] leading-relaxed text-ivory/90 md:space-y-6 md:text-lg">
                <p className="text-xl leading-relaxed text-ivory md:text-2xl">
                  Lilian Azzam moves between the opera stage, the concert
                  platform, and the quiet intensity of art song — always with
                  a voice built on clarity and colour.
                </p>
                <p>
                  Her repertoire rests on Mozart and Italian bel canto, then
                  opens into German Lieder, French mélodie, and sacred works
                  from Bach to Fauré.
                </p>
                <p>
                  She trained in classical singing at the Higher Institute of
                  Music. The result is a singer equally at home in the wit of
                  Figaro, the moonlight of Rusalka, and the still centre of
                  Schubert.
                </p>
              </div>
            </Phrase>
          </div>
        </div>
      </section>

      <section className="panel px-[var(--spacing-gutter)] py-[var(--spacing-section)]">
        <div className="mx-auto max-w-6xl">
          <ProgramRepertoire />
        </div>
      </section>

      <section className="px-[var(--spacing-gutter)] py-[var(--spacing-section)]">
        <div className="mx-auto max-w-6xl">
          <WorkshopsResume />
        </div>
      </section>
    </div>
  )
}
