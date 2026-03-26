import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { fetchYoutubeWatchData } from '../../../lib/youtube-feed'

export const Route = createFileRoute('/api/watch/$videoId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const apiKey = process.env.YOUTUBE_API_KEY ?? ''
        const payload = await fetchYoutubeWatchData(apiKey, params.videoId)
        return json(payload)
      },
    },
  },
})
