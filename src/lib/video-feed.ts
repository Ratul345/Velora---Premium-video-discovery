import { type FeedVideo, type WatchPageData } from './youtube-feed'

export type { FeedVideo, WatchComment, WatchPageData, WatchVideo } from './youtube-feed'

export async function loadDiscoverFeed(): Promise<FeedVideo[]> {
  const response = await fetch('/api/discover')

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
