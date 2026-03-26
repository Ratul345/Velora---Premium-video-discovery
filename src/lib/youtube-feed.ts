const API_ROOT = 'https://www.googleapis.com/youtube/v3'
const REGION = 'BD'
const MAX_RESULTS = 12

type DiscoverOptions = {
  likes?: string[]
  dislikes?: string[]
}

type YoutubeVideoItem = {
  id: string
  snippet: {
    title: string
    channelId: string
    channelTitle: string
    publishedAt: string
    description?: string
    thumbnails: {
      medium?: { url: string }
      high?: { url: string }
      standard?: { url: string }
      maxres?: { url: string }
    }
  }
  statistics?: {
    viewCount?: string
    likeCount?: string
    commentCount?: string
  }
  contentDetails?: {
    duration?: string
  }
}

type YoutubeSearchItem = {
  id?: {
    videoId?: string
  }
  snippet: {
    title: string
    channelId: string
    channelTitle: string
    publishedAt: string
    thumbnails: {
      medium?: { url: string }
      high?: { url: string }
    }
  }
}

type YoutubeChannelItem = {
  id: string
  snippet: {
    thumbnails: {
      default?: { url: string }
      medium?: { url: string }
      high?: { url: string }
    }
  }
  statistics?: {
    subscriberCount?: string
  }
}

type YoutubeCommentItem = {
  snippet?: {
    topLevelComment?: {
      snippet?: {
        authorDisplayName?: string
        authorProfileImageUrl?: string
        textDisplay?: string
        likeCount?: number
        publishedAt?: string
      }
    }
  }
}

type YoutubeListResponse<T> = {
  items?: T[]
}

export type FeedVideo = {
  id: string
  title: string
  channelTitle: string
  channelImage: string
  thumbnail: string
  duration: string
  views: string
  published: string
}

export type WatchComment = {
  id: string
  author: string
  authorImage: string
  text: string
  likes: string
  published: string
}

export type WatchVideo = FeedVideo & {
  description: string
  likeCount: string
  commentCount: string
  subscriberCount: string
  embedUrl: string
}

export type WatchPageData = {
  video: WatchVideo
  relatedVideos: FeedVideo[]
  comments: WatchComment[]
}

export async function fetchYoutubeDiscoverFeed(
  apiKey: string,
  options: DiscoverOptions = {},
): Promise<FeedVideo[]> {
  const normalizedKey = ensureApiKey(apiKey)
  const likes = normalizeTopics(options.likes)
  const dislikes = normalizeTopics(options.dislikes)

  const videos =
    likes.length > 0
      ? await fetchInterestVideos(normalizedKey, likes)
      : await fetchPopularVideos(normalizedKey)

  const filteredVideos = filterVideosByDislikes(videos, dislikes)
  const limitedVideos = filteredVideos.slice(0, MAX_RESULTS)

  return mapVideosWithChannels(limitedVideos, normalizedKey)
}

export async function fetchYoutubeWatchData(
  apiKey: string,
  videoId: string,
): Promise<WatchPageData> {
  const normalizedKey = ensureApiKey(apiKey)
  const detailUrl = new URL(`${API_ROOT}/videos`)
  detailUrl.searchParams.set('part', 'snippet,contentDetails,statistics')
  detailUrl.searchParams.set('id', videoId)
  detailUrl.searchParams.set('key', normalizedKey)

  const detailResponse = await fetch(detailUrl.toString())

  if (!detailResponse.ok) {
    throw new Error('Unable to load this video right now.')
  }

  const detailPayload = (await detailResponse.json()) as YoutubeListResponse<YoutubeVideoItem>
  const currentVideo = detailPayload.items?.[0]

  if (!currentVideo) {
    throw new Error('Video not found.')
  }

  const channelMap = await loadChannelDetails([currentVideo.snippet.channelId], normalizedKey)
  const relatedVideos = await fetchRelatedVideos(normalizedKey, videoId)
  const mappedRelatedVideos = await mapVideosWithChannels(relatedVideos, normalizedKey)
  const comments = await fetchComments(normalizedKey, videoId)
  const channel = channelMap.get(currentVideo.snippet.channelId)

  return {
    video: {
      id: currentVideo.id,
      title: currentVideo.snippet.title,
      channelTitle: currentVideo.snippet.channelTitle,
      channelImage: channel?.image ?? 'https://placehold.co/80x80/111827/f8fafc?text=V',
      thumbnail: pickThumbnail(currentVideo),
      duration: formatDuration(currentVideo.contentDetails?.duration),
      views: formatCompactNumber(currentVideo.statistics?.viewCount),
      published: formatRelativeDate(currentVideo.snippet.publishedAt),
      description: currentVideo.snippet.description?.trim() || 'No description available.',
      likeCount: formatCompactCount(currentVideo.statistics?.likeCount, 'likes'),
      commentCount: formatCompactCount(currentVideo.statistics?.commentCount, 'comments'),
      subscriberCount: channel?.subscriberCount ?? 'Creator',
      embedUrl: `https://www.youtube-nocookie.com/embed/${currentVideo.id}?rel=0&modestbranding=1`,
    },
    relatedVideos: mappedRelatedVideos,
    comments,
  }
}

function ensureApiKey(apiKey: string) {
  const normalizedKey = apiKey.trim()

  if (!normalizedKey) {
    throw new Error('Missing YOUTUBE_API_KEY in .env.local')
  }

  return normalizedKey
}

function normalizeTopics(values?: string[]) {
  return [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))]
}

async function fetchPopularVideos(apiKey: string) {
  const videosUrl = new URL(`${API_ROOT}/videos`)
  videosUrl.searchParams.set('part', 'snippet,contentDetails,statistics')
  videosUrl.searchParams.set('chart', 'mostPopular')
  videosUrl.searchParams.set('maxResults', String(MAX_RESULTS))
  videosUrl.searchParams.set('regionCode', REGION)
  videosUrl.searchParams.set('key', apiKey)

  const response = await fetch(videosUrl.toString())

  if (!response.ok) {
    throw new Error('Unable to load the video feed right now.')
  }

  const payload = (await response.json()) as YoutubeListResponse<YoutubeVideoItem>
  return payload.items ?? []
}

async function fetchInterestVideos(apiKey: string, likes: string[]) {
  const selectedTopics = likes.slice(0, 3)
  const searchResults = await Promise.all(
    selectedTopics.map((topic) => searchVideosByTopic(apiKey, topic)),
  )

  const videoIds = [...new Set(searchResults.flat())]

  if (videoIds.length === 0) {
    return fetchPopularVideos(apiKey)
  }

  return fetchVideosByIds(apiKey, videoIds.slice(0, 18))
}

async function searchVideosByTopic(apiKey: string, topic: string) {
  const searchUrl = new URL(`${API_ROOT}/search`)
  searchUrl.searchParams.set('part', 'snippet')
  searchUrl.searchParams.set('type', 'video')
  searchUrl.searchParams.set('maxResults', '8')
  searchUrl.searchParams.set('order', 'relevance')
  searchUrl.searchParams.set('q', topic)
  searchUrl.searchParams.set('regionCode', REGION)
  searchUrl.searchParams.set('safeSearch', 'moderate')
  searchUrl.searchParams.set('key', apiKey)

  const response = await fetch(searchUrl.toString())

  if (!response.ok) {
    return []
  }

  const payload = (await response.json()) as YoutubeListResponse<YoutubeSearchItem>
  return (payload.items ?? [])
    .map((item) => item.id?.videoId)
    .filter((videoId): videoId is string => Boolean(videoId))
}

async function fetchVideosByIds(apiKey: string, videoIds: string[]) {
  const videosUrl = new URL(`${API_ROOT}/videos`)
  videosUrl.searchParams.set('part', 'snippet,contentDetails,statistics')
  videosUrl.searchParams.set('id', videoIds.join(','))
  videosUrl.searchParams.set('key', apiKey)

  const response = await fetch(videosUrl.toString())

  if (!response.ok) {
    return []
  }

  const payload = (await response.json()) as YoutubeListResponse<YoutubeVideoItem>
  return payload.items ?? []
}

function filterVideosByDislikes(videos: YoutubeVideoItem[], dislikes: string[]) {
  if (dislikes.length === 0) {
    return videos
  }

  return videos.filter((video) => {
    const haystack = [
      video.snippet.title,
      video.snippet.channelTitle,
      video.snippet.description ?? '',
    ].join(' ')

    return dislikes.every((topic) => !matchesBlockedTopic(haystack, topic))
  })
}

function matchesBlockedTopic(haystack: string, topic: string) {
  const normalizedTopic = topic.trim()

  if (!normalizedTopic) {
    return false
  }

  const escapedTopic = escapeRegExp(normalizedTopic)
  const pattern = new RegExp(`\\b${escapedTopic}\\b`, 'i')
  return pattern.test(haystack)
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')
}

async function fetchRelatedVideos(apiKey: string, videoId: string) {
  const relatedUrl = new URL(`${API_ROOT}/search`)
  relatedUrl.searchParams.set('part', 'snippet')
  relatedUrl.searchParams.set('type', 'video')
  relatedUrl.searchParams.set('relatedToVideoId', videoId)
  relatedUrl.searchParams.set('maxResults', '10')
  relatedUrl.searchParams.set('key', apiKey)

  const response = await fetch(relatedUrl.toString())

  if (!response.ok) {
    return []
  }

  const payload = (await response.json()) as YoutubeListResponse<YoutubeSearchItem>
  const ids = (payload.items ?? [])
    .map((item) => item.id?.videoId)
    .filter((item): item is string => Boolean(item))

  return fetchVideosByIds(apiKey, ids)
}

async function fetchComments(apiKey: string, videoId: string): Promise<WatchComment[]> {
  const commentsUrl = new URL(`${API_ROOT}/commentThreads`)
  commentsUrl.searchParams.set('part', 'snippet')
  commentsUrl.searchParams.set('videoId', videoId)
  commentsUrl.searchParams.set('maxResults', '8')
  commentsUrl.searchParams.set('order', 'relevance')
  commentsUrl.searchParams.set('textFormat', 'plainText')
  commentsUrl.searchParams.set('key', apiKey)

  const response = await fetch(commentsUrl.toString())

  if (!response.ok) {
    return []
  }

  const payload = (await response.json()) as YoutubeListResponse<YoutubeCommentItem>

  return (payload.items ?? []).map((item, index) => {
    const comment = item.snippet?.topLevelComment?.snippet

    return {
      id: `${videoId}-${index}`,
      author: comment?.authorDisplayName ?? 'Viewer',
      authorImage:
        comment?.authorProfileImageUrl ?? 'https://placehold.co/48x48/111827/f8fafc?text=V',
      text: comment?.textDisplay ?? 'No comment text available.',
      likes: formatCompactCount(String(comment?.likeCount ?? 0), 'likes'),
      published: formatRelativeDate(comment?.publishedAt ?? new Date().toISOString()),
    }
  })
}

async function mapVideosWithChannels(videos: YoutubeVideoItem[], apiKey: string) {
  const channelIds = [...new Set(videos.map((video) => video.snippet.channelId))]
  const channelMap = await loadChannelDetails(channelIds, apiKey)

  return videos.map((video) => ({
    id: video.id,
    title: video.snippet.title,
    channelTitle: video.snippet.channelTitle,
    channelImage:
      channelMap.get(video.snippet.channelId)?.image ??
      'https://placehold.co/80x80/111827/f8fafc?text=V',
    thumbnail: pickThumbnail(video),
    duration: formatDuration(video.contentDetails?.duration),
    views: formatCompactNumber(video.statistics?.viewCount),
    published: formatRelativeDate(video.snippet.publishedAt),
  }))
}

async function loadChannelDetails(channelIds: string[], apiKey: string) {
  if (channelIds.length === 0) {
    return new Map<string, { image: string; subscriberCount: string }>()
  }

  const channelsUrl = new URL(`${API_ROOT}/channels`)
  channelsUrl.searchParams.set('part', 'snippet,statistics')
  channelsUrl.searchParams.set('id', channelIds.join(','))
  channelsUrl.searchParams.set('key', apiKey)

  const channelResponse = await fetch(channelsUrl.toString())

  if (!channelResponse.ok) {
    return new Map<string, { image: string; subscriberCount: string }>()
  }

  const channelPayload = (await channelResponse.json()) as YoutubeListResponse<YoutubeChannelItem>

  return new Map(
    (channelPayload.items ?? []).map((channel) => [
      channel.id,
      {
        image:
          channel.snippet.thumbnails.medium?.url ??
          channel.snippet.thumbnails.default?.url ??
          '',
        subscriberCount: formatCompactCount(
          channel.statistics?.subscriberCount,
          'subscribers',
        ),
      },
    ]),
  )
}

function pickThumbnail(video: YoutubeVideoItem) {
  return (
    video.snippet.thumbnails.maxres?.url ??
    video.snippet.thumbnails.standard?.url ??
    video.snippet.thumbnails.high?.url ??
    video.snippet.thumbnails.medium?.url ??
    'https://placehold.co/640x360/111827/f8fafc?text=Velora'
  )
}

function formatDuration(rawDuration?: string) {
  if (!rawDuration) {
    return 'Live'
  }

  const match = rawDuration.match(/P(?:\d+Y)?(?:\d+M)?(?:\d+D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)

  if (!match) {
    return 'Live'
  }

  const hours = Number(match[1] ?? 0)
  const minutes = Number(match[2] ?? 0)
  const seconds = Number(match[3] ?? 0)

  if (hours > 0) {
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
  }

  return [minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
}

function formatCompactNumber(value?: string) {
  const amount = Number(value ?? 0)

  if (!Number.isFinite(amount) || amount <= 0) {
    return 'New'
  }

  return `${new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)} views`
}

function formatCompactCount(value?: string, suffix?: string) {
  const amount = Number(value ?? 0)

  if (!Number.isFinite(amount) || amount <= 0) {
    return suffix ? `0 ${suffix}` : '0'
  }

  const formatted = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)

  return suffix ? `${formatted} ${suffix}` : formatted
}

function formatRelativeDate(value: string) {
  const publishedAt = new Date(value)
  const now = Date.now()
  const diffDays = Math.max(0, Math.floor((now - publishedAt.getTime()) / (1000 * 60 * 60 * 24)))

  if (diffDays < 1) {
    return 'today'
  }

  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  }

  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`
  }

  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months === 1 ? '' : 's'} ago`
  }

  const years = Math.floor(diffDays / 365)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

