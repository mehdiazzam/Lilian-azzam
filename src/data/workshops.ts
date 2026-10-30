export type Workshop = {
  title: string
  instructors: string
  venue: string
  date: string
  year: number
}

export const workshops: Workshop[] = [

  {
    year: 2026,
    title: 'Vocal Performance Workshop',
    instructors: 'Dimah Orsho',
    venue: 'Higher Institute of Music, Damascus',
    date: '7–8 September 2026',
  },
  {
    year: 2026,
    title: 'Choral & Orchestral Conducting Workshop',
    instructors: 'Ghassan Aboud, Syrian Maestro',
    venue: 'Higher Institute of Music, Damascus',
    date: '5 July 2026',
  },


  {
    year: 2022,
    title: 'Classical Singing & Stage Performance Workshop',
    instructors:
      'Soumaya Hallak, Soprano; Didier Carrier, French Director; Rasha Abu Shaker, Head of Classical Singing Department',
    venue: 'Higher Institute of Music, Damascus',
    date: '25–26 May 2022',
  },
  {
    year: 2022,
    title: 'Vocal Performance Workshop',
    instructors: 'Soumaya Hallak, Soprano',
    venue: 'Higher Institute of Music, Damascus',
    date: '19–20 January 2022',
  },
  {
    year: 2022,
    title: 'Online Vocal Workshop',
    instructors:
      'Dr. Darryl Edwards, Tenor, Director of COSA, University of Toronto',
    venue: 'Online via Zoom',
    date: '2022',
  },
  {
    year: 2022,
    title: 'Performance Workshop – Stage Acting',
    instructors: 'Noura Murad',
    venue: 'Italian Theater Stage, Damascus',
    date: '28 April–1 May 2022',
  },


  {
    year: 2021,
    title: 'Vocal Performance Workshop',
    instructors:
      'Stéphane Sénéchal, Tenor; Béatrice Carat, Soprano; Wathiq Salman, Baritone',
    venue: 'Higher Institute of Music, Damascus',
    date: '11 September 2021',
  },
]

export function groupWorkshopsByYear(
  items: Workshop[],
): { year: number; workshops: Workshop[] }[] {
  const years = Array.from(new Set(items.map((w) => w.year))).sort(
    (a, b) => b - a,
  )
  return years.map((year) => ({
    year,
    workshops: items.filter((w) => w.year === year),
  }))
}
