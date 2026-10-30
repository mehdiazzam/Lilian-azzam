export type VideoItem = {
  id: string
  title: string
  subtitle: string

  videoKey?: string

  thumbnailKey?: string
}

export type PhotoItem = {
  id: string
  label: string

  imageKey?: string
  aspect: 'tall' | 'wide' | 'square'
}

export const heroVideoKey = 'videos/hero-loop.mp4'
export const heroPosterKey = 'thumbnails/hero-poster.jpg'

export const videos: VideoItem[] = [
  {
    id: '1',
    title: 'Rusalka (Song to the Moon)',
    subtitle: 'Dvořák — Performance',
    videoKey: '1.mp4',
    thumbnailKey: '/portfolio-img/photo_5859236300249042780_y.jpg',
  },
  {
    id: '2',
    title: "Ach, ich fühl's",
    subtitle: 'Mozart · Die Zauberflöte',
    videoKey: '2.mp4',
    thumbnailKey: '/portfolio-img/photo_5859236300249042780_y.jpg',
  },
  {
    id: '3',
    title: 'O mio babbino caro',
    subtitle: 'Puccini · Gianni Schicchi',
    videoKey: '3.webm',
    thumbnailKey: '/portfolio-img/photo_5859236300249042780_y.jpg',
  },
  {
    id: '4',
    title: 'Deh vieni, non tardar',
    subtitle: 'Mozart · Le nozze di Figaro',
    videoKey: '4.mp4',
    thumbnailKey: '/portfolio-img/photo_5859236300249042780_y.jpg',
  },
  {
    id: '6',
    title: 'Gretchen am Spinnrade',
    subtitle: 'Schubert',
    videoKey: '6.mp4',
    thumbnailKey: '/portfolio-img/photo_5859236300249042780_y.jpg',
  },
  {
    id: '7',
    title: 'Voi che sapete',
    subtitle: 'Mozart · Le nozze di Figaro',
    videoKey: '7.mp4',
    thumbnailKey: '/portfolio-img/photo_5859236300249042780_y.jpg',
  },
  {
    id: '8',
    title: 'Oh quante volte',
    subtitle: 'Bellini · I Capuleti e i Montecchi',
    videoKey: '8.mp4',
    thumbnailKey: '/portfolio-img/photo_5859236300249042780_y.jpg',
  },
  {
    id: '9',
    title: 'Ave Maria',
    subtitle: 'Bach / Gounod',
    videoKey: '9.mp4',
    thumbnailKey: '/portfolio-img/photo_5859236300249042780_y.jpg',
  },
  {
    id: '10',
    title: 'When I am laid in earth',
    subtitle: 'Purcell · Dido and Aeneas',
    videoKey: '10.mp4',
    thumbnailKey: '/portfolio-img/photo_5859236300249042780_y.jpg',
  },
]

export const photos: PhotoItem[] = [
  {
    id: '1',
    label: 'Portrait — rehearsal studio',
    aspect: 'wide',
    imageKey: '/portfolio-img/photo_5929417152492408724_y.jpg',
  },
  {
    id: '2',
    label: 'Rehearsal with piano',
    aspect: 'wide',
    imageKey: '/portfolio-img/photo_5859236300249042787_y.jpg',
  },
  {
    id: '3',
    label: 'Solo recital',
    aspect: 'wide',
    imageKey: '/portfolio-img/photo_5859236300249042781_y.jpg',
  },
  {
    id: '4',
    label: 'Syrian Opera — choir',
    aspect: 'wide',
    imageKey: '/portfolio-img/photo_5859236300249042757_y.jpg',
  },
  {
    id: '5',
    label: 'Ensemble in traditional dress',
    aspect: 'wide',
    imageKey: '/portfolio-img/photo_5859236300249042764_y.jpg',
  },
  {
    id: '6',
    label: 'Stage scene',
    aspect: 'wide',
    imageKey: '/portfolio-img/photo_5859236300249042780_y.jpg',
  },
  {
    id: '7',
    label: 'Cast after the performance',
    aspect: 'wide',
    imageKey: '/portfolio-img/photo_5859236300249042782_y.jpg',
  },
  {
    id: '8',
    label: 'Curtain call',
    aspect: 'wide',
    imageKey: '/portfolio-img/photo_5859236300249042783_y.jpg',
  },
  {
    id: '9',
    label: 'Gardenia Choir',
    aspect: 'tall',
    imageKey: '/portfolio-img/01-489030232_17896119723190643_5906880110464507669_n.jpg',
  },
  {
    id: '10',
    label: 'Gardenia Choir — Beit Farhi',
    aspect: 'tall',
    imageKey: '/portfolio-img/03-488619990_17896119741190643_2519270693540531004_n.jpg',
  },
]

export const showreelKey = 'videos/showreel.mp4'
