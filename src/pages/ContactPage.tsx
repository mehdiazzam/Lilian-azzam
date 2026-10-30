import { Phrase } from '../components/motion/Phrase'
import { PageHeader } from '../components/chrome/PageHeader'
import {
  IconEmail,
  IconFacebook,
  IconInstagram,
  IconPhone,
} from '../components/contact/ContactIcons'
import {
  contactChannels,
  contactMeta,
  type ContactChannelId,
} from '../data/data'

const icons: Record<
  ContactChannelId,
  typeof IconInstagram
> = {
  instagram: IconInstagram,
  phone: IconPhone,
  facebook: IconFacebook,
  email: IconEmail,
}

export function ContactPage() {
  return (
    <div className="pt-20 lg:pt-12">
      <section className="relative px-[var(--spacing-gutter)] py-[var(--spacing-section)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-[28rem] max-w-3xl bg-[radial-gradient(ellipse_at_center,rgba(242,200,121,0.08),transparent_65%)]"
        />

        <div className="relative mx-auto max-w-4xl">
          <PageHeader
            align="center"
            movement="IV. Coda"
            title={
              <>
                Reach{' '}
                <span className="text-gold-foil italic">Lilian</span>
              </>
            }
            intro="Casting, bookings, and press — choose a channel below."
          />

          <Phrase beat={1}>
            <p className="mt-6 text-center text-[0.9375rem] tracking-wide text-dust">
              {contactMeta.homeBase}
            </p>
          </Phrase>

          <Phrase beat={2}>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
              {contactChannels.map(({ id, label, href, value, hint }) => {
                const Icon = icons[id]
                const external = href.startsWith('http')
                return (
                  <li key={id}>
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="group stage-spot relative flex h-full flex-col items-center gap-5 overflow-hidden border border-line-soft px-6 py-10 text-center no-underline transition-colors hover:border-gold/45 hover:bg-gold/[0.04]"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute top-0 left-0 h-5 w-5 border-t border-l border-gold/40 transition-colors group-hover:border-gold/70"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute top-0 right-0 h-5 w-5 border-t border-r border-gold/40 transition-colors group-hover:border-gold/70"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b border-l border-gold/40 transition-colors group-hover:border-gold/70"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute right-0 bottom-0 h-5 w-5 border-r border-b border-gold/40 transition-colors group-hover:border-gold/70"
                      />

                      <span className="relative z-10 flex h-14 w-14 items-center justify-center border border-gold/40 text-gold transition-colors group-hover:border-gold group-hover:bg-gold/10">
                        <Icon width={22} height={22} />
                      </span>

                      <span className="relative z-10 space-y-1.5">
                        <span className="label-movement block text-gold">
                          {label}
                        </span>
                        <span className="block text-lg font-medium text-ivory transition-colors group-hover:text-gold-foil">
                          {value}
                        </span>
                        <span className="block text-[0.8125rem] text-dust">
                          {hint}
                        </span>
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </Phrase>
        </div>
      </section>
    </div>
  )
}
