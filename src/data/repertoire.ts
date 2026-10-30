export type RepertoireCategory =
  | 'operatic'
  | 'concert'
  | 'artSongGerman'
  | 'artSongFrench'
  | 'artSongEnglish'
  | 'artSongItalian'
  | 'artSongOther'

export type RepertoireItem = {
  piece: string
  composer: string
  workGroup?: string
  category: RepertoireCategory
}

export const repertoire: RepertoireItem[] = [

  {
    piece: 'Song to the Moon (Moon Songs)',
    composer: 'Dvořák',
    workGroup: 'Rusalka',
    category: 'operatic',
  },
  {
    piece: 'Venite inginocchiatevi',
    composer: 'Mozart',
    workGroup: 'Le nozze di Figaro',
    category: 'operatic',
  },
  {
    piece: 'Batti, batti',
    composer: 'Mozart',
    workGroup: 'Don Giovanni',
    category: 'operatic',
  },
  {
    piece: 'Vorrei spiegarvi, o Dio',
    composer: 'Mozart',
    category: 'operatic',
  },
  {
    piece: "L'ho perduta… me meschina",
    composer: 'Mozart',
    workGroup: 'Le nozze di Figaro',
    category: 'operatic',
  },
  {
    piece: 'Voi che sapete',
    composer: 'Mozart',
    workGroup: 'Le nozze di Figaro',
    category: 'operatic',
  },
  {
    piece: 'Deh vieni, non tardar',
    composer: 'Mozart',
    workGroup: 'Le nozze di Figaro',
    category: 'operatic',
  },
  {
    piece: "Sull'aria",
    composer: 'Mozart',
    workGroup: 'Le nozze di Figaro · duet',
    category: 'operatic',
  },
  {
    piece: 'Stizzoso, mio stizzoso',
    composer: 'Mozart',
    category: 'operatic',
  },
  {
    piece: "Ach, ich fühl's",
    composer: 'Mozart',
    workGroup: 'Die Zauberflöte',
    category: 'operatic',
  },
  {
    piece: 'O mio babbino caro',
    composer: 'Puccini',
    workGroup: 'Gianni Schicchi',
    category: 'operatic',
  },
  {
    piece: 'Oh! quante volte',
    composer: 'Bellini',
    workGroup: 'I Capuleti e i Montecchi',
    category: 'operatic',
  },
  {
    piece: 'Il faut partir',
    composer: 'Donizetti',
    category: 'operatic',
  },
  {
    piece: 'When I am laid in earth',
    composer: 'Purcell',
    workGroup: 'Dido and Aeneas',
    category: 'operatic',
  },


  {
    piece: 'Lacrimosa',
    composer: 'Mozart',
    workGroup: 'Requiem',
    category: 'concert',
  },
  {
    piece: 'Bist du bei mir',
    composer: 'Bach',
    category: 'concert',
  },
  {
    piece: 'Quia respexit',
    composer: 'Bach',
    category: 'concert',
  },
  {
    piece: 'Schafe können sicher weiden',
    composer: 'Bach',
    category: 'concert',
  },
  {
    piece: 'Mein gläubiges Herze',
    composer: 'Bach',
    category: 'concert',
  },
  {
    piece: 'Die Seele ruht in Jesu Händen',
    composer: 'Bach',
    category: 'concert',
  },
  {
    piece: 'Vedrò con mio diletto',
    composer: 'Vivaldi',
    category: 'concert',
  },
  {
    piece: 'Ave Maria',
    composer: 'Bach / Gounod',
    category: 'concert',
  },
  {
    piece: 'Pie Jesu',
    composer: 'Fauré',
    category: 'concert',
  },
  {
    piece: 'Stabat Mater',
    composer: 'Pergolesi',
    workGroup: 'Full score · choir',
    category: 'concert',
  },
  {
    piece: 'Dies irae',
    composer: 'Cherubini',
    workGroup: 'Requiem',
    category: 'concert',
  },
  {
    piece: 'Ave Maria',
    composer: 'A. L. Webber',
    category: 'concert',
  },


  {
    piece: 'Gretchen am Spinnrade',
    composer: 'Schubert',
    category: 'artSongGerman',
  },
  {
    piece: 'Du bist die Ruh',
    composer: 'Schubert',
    category: 'artSongGerman',
  },
  {
    piece: 'An Sylvia',
    composer: 'Schubert',
    category: 'artSongGerman',
  },
  {
    piece: 'Erlkönig',
    composer: 'Schubert',
    category: 'artSongGerman',
  },
  {
    piece: 'Heidenröslein',
    composer: 'Schubert',
    category: 'artSongGerman',
  },
  {
    piece: 'Widmung',
    composer: 'Schumann',
    category: 'artSongGerman',
  },


  {
    piece: 'Les filles de Cadix',
    composer: 'Delibes',
    category: 'artSongFrench',
  },


  {
    piece: 'Songs My Mother Taught Me',
    composer: 'Dvořák',
    category: 'artSongOther',
  },
  {
    piece: 'Vocalise',
    composer: 'Rachmaninoff',
    category: 'artSongOther',
  },


  {
    piece: 'Malinconia, Ninfa gentile',
    composer: 'Bellini',
    category: 'artSongItalian',
  },
  {
    piece: 'Ma rendi pur contento',
    composer: 'Bellini',
    category: 'artSongItalian',
  },
  {
    piece: 'Il fervido desiderio',
    composer: 'Bellini',
    category: 'artSongItalian',
  },
  {
    piece: "Se tu m'ami",
    composer: 'Pergolesi',
    category: 'artSongItalian',
  },
]

export type AccordionSection = {
  id: string
  title: string
  items: RepertoireItem[]
  subsections?: { title: string; items: RepertoireItem[] }[]
}

export function getRepertoireAccordion(): AccordionSection[] {
  const by = (cat: RepertoireCategory) =>
    repertoire.filter((r) => r.category === cat)

  return [
    {
      id: 'operatic',
      title: 'Operatic roles',
      items: by('operatic'),
    },
    {
      id: 'concert',
      title: 'Concert & oratorio',
      items: by('concert'),
    },
    {
      id: 'art-song',
      title: 'Art song — recital sets',
      items: [],
      subsections: [
        { title: 'German', items: by('artSongGerman') },
        { title: 'French', items: by('artSongFrench') },
        { title: 'Italian', items: by('artSongItalian') },
        { title: 'Other languages', items: by('artSongOther') },
      ],
    },
  ]
}
