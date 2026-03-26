import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { fetchYoutubeDiscoverFeed } from '../../lib/youtube-feed'

export const Route = createFileRoute('/api/discover')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const apiKey = process.env.YOUTUBE_API_KEY ?? ''
        const url = new URL(request.url)
        const likes = url.searchParams.getAll('like')
        const dislikes = url.searchParams.getAll('dislike')
        const videos = await fetchYoutubeDiscoverFeed(apiKey, {
          likes,
          dislikes,
        })
        return json(videos)
      },
    },
  },
})
