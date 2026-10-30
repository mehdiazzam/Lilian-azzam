import { groupWorkshopsByYear, workshops } from '../../data/workshops'
import { Phrase } from '../motion/Phrase'

const grouped = groupWorkshopsByYear(workshops)

export function WorkshopsResume() {
  return (
    <div>
      <Phrase>
        <p className="label-movement text-center text-gold">Formation</p>
        <h2 className="mt-3 text-center font-display text-3xl font-bold text-ivory md:text-4xl">
          Workshops
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[0.9375rem] leading-relaxed text-dust">
          Vocal, stage, and conducting study with artists and pedagogues.
        </p>
      </Phrase>

      <div className="mt-8 space-y-12">
        {grouped.map((group, gi) => (
          <Phrase key={group.year} beat={gi}>
            <div className="grid gap-8 md:grid-cols-[7rem_1fr] md:gap-12">
              <div className="flex flex-col items-start gap-2 md:items-center">
                <span
                  className="font-display text-3xl italic text-gold/70"
                  aria-hidden
                >
                  𝄞
                </span>
                <p className="font-display text-4xl font-bold text-gold">
                  {group.year}
                </p>
              </div>
              <ul className="relative space-y-10 border-l border-gold/25 pl-8">
                {group.workshops.map((w) => (
                  <li key={`${w.title}-${w.date}`} className="relative">
                    <span
                      aria-hidden
                      className="absolute top-2 -left-8 h-2 w-2 -translate-x-1/2 rounded-full border border-gold bg-velvet"
                    />
                    <p className="label-movement text-[0.75rem] text-dust">
                      {w.date}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-ivory">
                      {w.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-dust">
                      {w.instructors}
                    </p>
                    <p className="mt-1 text-[0.875rem] text-dust/80">{w.venue}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Phrase>
        ))}
      </div>
    </div>
  )
}
