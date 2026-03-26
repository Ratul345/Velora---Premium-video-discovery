import { createFileRoute } from '@tanstack/react-router'
import { SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import OnboardingModal from '../components/OnboardingModal'
import {
  defaultPreferences,
  navigationGroups,
  type UserPreferences,
} from '../lib/discover'
import {
  hasMeaningfulPreferences,
  readStoredPreferences,
  saveStoredPreferences,
} from '../lib/preferences'
import { type FeedVideo, loadDiscoverFeed } from '../lib/video-feed'

type HomeSearch = {
  q?: string
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): HomeSearch => ({
    q: typeof search.q === 'string' ? search.q : undefined,
  }),
  component: HomePage,
})

function HomePage() {
  const search = Route.useSearch()
  const [videos, setVideos] = useState<FeedVideo[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [preferencesReady, setPreferencesReady] = useState(false)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)

  useEffect(() => {
    const storedPreferences = readStoredPreferences()
    setPreferences(storedPreferences)
    setPreferencesReady(true)
    setIsOnboardingOpen(!hasMeaningfulPreferences(storedPreferences))
  }, [])

  useEffect(() => {
    if (!preferencesReady) {
      return
    }

    let cancelled = false
    setStatus('loading')

    async function fetchVideos() {
      try {
        const nextVideos = await loadDiscoverFeed(preferences)

        if (!cancelled) {
          setVideos(nextVideos)
          setStatus('ready')
        }
      } catch (error) {
        if (!cancelled) {
          setStatus('error')
          setErrorMessage(
            error instanceof Error ? error.message : 'Feed loading failed.',
          )
        }
      }
    }

    fetchVideos()

    return () => {
      cancelled = true
    }
  }, [preferences, preferencesReady])

  const visibleVideos = useMemo(() => {
    const normalizedQuery = (search.q ?? '').trim().toLowerCase()

    return videos.filter((video) => {
      if (normalizedQuery.length === 0) {
        return true
      }

      return (
        video.title.toLowerCase().includes(normalizedQuery) ||
        video.channelTitle.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [search.q, videos])

  function updatePreferences(nextPreferences: UserPreferences) {
    setPreferences(nextPreferences)
    saveStoredPreferences(nextPreferences)
  }

  function toggleLike(topic: string) {
    updatePreferences({
      likes: preferences.likes.includes(topic)
        ? preferences.likes.filter((item) => item !== topic)
        : [...preferences.likes, topic],
      dislikes: preferences.dislikes.filter((item) => item !== topic),
    })
  }

  function toggleDislike(topic: string) {
    updatePreferences({
      likes: preferences.likes.filter((item) => item !== topic),
      dislikes: preferences.dislikes.includes(topic)
        ? preferences.dislikes.filter((item) => item !== topic)
        : [...preferences.dislikes, topic],
    })
  }

  function resetPreferences() {
    updatePreferences(defaultPreferences)
  }

  return (
    <>
      <OnboardingModal
        isOpen={isOnboardingOpen}
        preferences={preferences}
        onToggleLike={toggleLike}
        onToggleDislike={toggleDislike}
        onClose={() => setIsOnboardingOpen(false)}
        onReset={resetPreferences}
        isFirstRun={!hasMeaningfulPreferences(preferences)}
      />

      <main className="page-wrap px-4 pb-10 pt-4 lg:px-0">
        <section className="content-shell">
          <aside className="sidebar-panel">
            {navigationGroups.map((group) => (
              <div key={group.title} className="sidebar-group">
                <p>{group.title}</p>
                {group.items.map((item) => (
                  <button key={item} type="button" className="sidebar-link">
                    {item}
                  </button>
                ))}
              </div>
            ))}
          </aside>

          <div className="feed-shell">
            <div className="feed-toolbar feed-toolbar--stacked">
              <div className="preference-bar">
                <div className="preference-summary">
                  {preferences.likes.length > 0 ? (
                    preferences.likes.map((topic) => (
                      <span key={topic} className="preference-chip preference-chip--like">
                        {topic}
                      </span>
                    ))
                  ) : (
                    <span className="preference-empty">Choose interests to tune your feed.</span>
                  )}
                </div>

                <button
                  type="button"
                  className="watch-action-button"
                  onClick={() => setIsOnboardingOpen(true)}
                >
                  <SlidersHorizontal size={16} />
                  Tune feed
                </button>
              </div>
            </div>

            {status === 'loading' && (
              <div className="video-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <article key={index} className="video-card skeleton-card">
                    <div className="skeleton-thumb" />
                    <div className="skeleton-line skeleton-line--title" />
                    <div className="skeleton-line" />
                  </article>
                ))}
              </div>
            )}

            {status === 'error' && (
              <div className="message-card">
                <p className="eyebrow">Feed unavailable</p>
                <h3>The feed could not be prepared right now.</h3>
                <p>{errorMessage}</p>
              </div>
            )}

            {status === 'ready' && (
              <>
                <div className="video-grid">
                  {visibleVideos.map((video) => (
                    <a key={video.id} href={`/watch/${video.id}`} className="video-card">
                      <div className="thumb-wrap">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="thumb-image"
                        />
                        <span className="duration-pill">{video.duration}</span>
                      </div>

                      <div className="video-meta">
                        <img
                          src={video.channelImage}
                          alt={video.channelTitle}
                          className="avatar-image"
                        />
                        <div>
                          <h3>{video.title}</h3>
                          <p>{video.channelTitle}</p>
                          <span>
                            {video.views} · {video.published}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {visibleVideos.length === 0 && (
                  <div className="message-card">
                    <p className="eyebrow">Nothing useful yet</p>
                    <h3>Your current preferences returned no strong matches.</h3>
                    <p>Try changing your interests or removing a few blocked topics.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
