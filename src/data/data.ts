

export type ContactChannelId =
  | 'instagram'
  | 'phone'
  | 'facebook'
  | 'email'

export type ContactChannel = {
  id: ContactChannelId
  label: string
  href: string
  value: string
  hint: string
}

export const contactChannels: ContactChannel[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://instagram.com/lilianazzam',
    value: '@lilianazzam',
    hint: 'Follow & updates',
  },
  {
    id: 'phone',
    label: 'Phone',
    href: 'tel:+963932421064',
    value: '+963 932 421 064',
    hint: 'Call or WhatsApp',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://facebook.com/lilian.azzam.35',
    value: 'Lilian Azzam',
    hint: 'Public page',
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:hello@example.com',
    value: 'hello@example.com',
    hint: 'Casting & press',
  },
]

export const contactMeta = {
  homeBase: 'Damascus · Available worldwide',
} as const
