export const exploreSections = [
  'All',
  'Cinematic',
  'Builders',
  'Mobile',
  'Design',
  'AI',
  'Audio',
  'Stories',
]

export const navigationGroups = [
  {
    title: 'Browse',
    items: ['Home', 'Fresh cuts', 'Spotlight', 'Following'],
  },
  {
    title: 'Library',
    items: ['Saved', 'Watch later', 'Liked', 'History'],
  },
  {
    title: 'Studio',
    items: ['Creator notes', 'Analytics', 'Draft ideas'],
  },
]

export const onboardingTopics = [
  'Technology',
  'Programming',
  'React',
  'AI',
  'Startups',
  'Design',
  'Mobile Repair',
  'Business',
  'Science',
  'Documentary',
  'Music',
  'Gaming',
  'Education',
  'Productivity',
  'Finance',
  'Podcasts',
]

export type UserPreferences = {
  likes: string[]
  dislikes: string[]
}

export const defaultPreferences: UserPreferences = {
  likes: [],
  dislikes: [],
}
