export type AudioTrack = {
  id: string
  title: string
  composer: string
  work?: string
  audioKey?: string
  durationLabel: string
}

export const soundBites: AudioTrack[] = [
  {
    id: '1',
    title: "Ach, ich fühl's",
    composer: 'Mozart',
    work: 'Die Zauberflöte',
    audioKey: '/audio/document_5859236299789049981.mp3',
    durationLabel: '2:07',
  },
  {
    id: '2',
    title: 'Song to the Moon',
    composer: 'Dvořák',
    work: 'Rusalka',
    audioKey: '/audio/document_5861918077368672376.mp3',
    durationLabel: '0:50',
  },
  {
    id: '3',
    title: 'O mio babbino caro',
    composer: 'Puccini',
    work: 'Gianni Schicchi',
    audioKey: '/audio/document_5861918077368672378.mp3',
    durationLabel: '0:40',
  },
]
