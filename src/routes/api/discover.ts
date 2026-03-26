import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { fetchYoutubeDiscoverFeed } from '../../lib/youtube-feed'

export const Route = createFileRoute('/api/discover')({
  server: {
    handlers: {
      GET: async () => {
        const apiKey = process.env.YOUTUBE_API_KEY ?? ''
        const videos = await fetchYoutubeDiscoverFeed(apiKey)
        return json(videos)
      },
    },
  },
})
