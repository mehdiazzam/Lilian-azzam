import {
  getRepertoireAccordion,
  type AccordionSection,
  type RepertoireItem,
} from '../../data/repertoire'
import { Barline } from '../chrome/Barlines'
import { Phrase } from '../motion/Phrase'

function ProgramLines({ items }: { items: RepertoireItem[] }) {
  return (
    <ul className="mx-auto max-w-2xl space-y-4">
      {items.map((item) => (
        <li
          key={`${item.category}-${item.composer}-${item.piece}`}
          className="program-row text-left"
        >
          <span className="min-w-0 text-[1.0625rem] font-medium leading-snug text-ivory sm:text-lg">
            {item.piece}
            {item.workGroup ? (
              <span className="mt-0.5 block text-[0.875rem] font-normal text-dust sm:mt-0 sm:ml-2 sm:inline">
                ({item.workGroup})
              </span>
            ) : null}
          </span>
          <span className="program-dots hidden sm:block" aria-hidden />
          <span className="shrink-0 text-[0.9375rem] font-medium text-gold sm:text-base">
            {item.composer}
          </span>
        </li>
      ))}
    </ul>
  )
}

function ProgramSection({ section }: { section: AccordionSection }) {
  return (
    <div className="py-6">
      <h3 className="label-movement mb-8 text-center text-gold">
        {section.title}
      </h3>
      {section.subsections ? (
        <div className="space-y-12">
          {section.subsections.map((sub) => (
            <div key={sub.title}>
              <h4 className="mb-5 text-center text-sm font-medium tracking-[0.12em] text-dust uppercase">
                {sub.title}
              </h4>
              <ProgramLines items={sub.items} />
            </div>
          ))}
        </div>
      ) : (
        <ProgramLines items={section.items} />
      )}
    </div>
  )
}

export function ProgramRepertoire() {
  const sections = getRepertoireAccordion()

  return (
    <div>
      <Phrase>
        <p className="label-movement text-center text-gold">Repertoire</p>
        <h2 className="mt-3 text-center font-display text-3xl font-bold text-ivory md:text-4xl">
          Tonight&apos;s programme
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-[0.9375rem] leading-relaxed text-dust">
          Operatic roles, concert works, and art-song sets prepared for the
          stage.
        </p>
      </Phrase>

      <div className="mt-8">
        {sections.map((section, i) => (
          <Phrase key={section.id} beat={i}>
            {i > 0 && (
              <div className="flex justify-center py-2">
                <Barline className="h-10" />
              </div>
            )}
            <ProgramSection section={section} />
          </Phrase>
        ))}
      </div>
    </div>
  )
}
