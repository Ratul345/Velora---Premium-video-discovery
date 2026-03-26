import { type FeedVideo, type WatchPageData } from './youtube-feed'
import { type UserPreferences } from './discover'

export type { FeedVideo, WatchComment, WatchPageData, WatchVideo } from './youtube-feed'

export async function loadDiscoverFeed(preferences?: UserPreferences): Promise<FeedVideo[]> {
  const url = new URL('/api/discover', window.location.origin)

  for (const like of preferences?.likes ?? []) {
    url.searchParams.append('like', like)
  }

  for (const dislike of preferences?.dislikes ?? []) {
    url.searchParams.append('dislike', dislike)
  }

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error('Unable to load the video feed right now.')
  }

  return (await response.json()) as FeedVideo[]
}

export async function loadWatchPage(videoId: string): Promise<WatchPageData> {
  const response = await fetch(`/api/watch/${videoId}`)

  if (!response.ok) {
    throw new Error('Unable to load this video right now.')
  }

  return (await response.json()) as WatchPageData
}
