import { createFileRoute } from '@tanstack/react-router'
import { Clock3 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { exploreSections, navigationGroups } from '../lib/discover'
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
  const [activeSection, setActiveSection] = useState('All')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchVideos() {
      try {
        const nextVideos = await loadDiscoverFeed()

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
  }, [])

  const visibleVideos = useMemo(() => {
    const normalizedQuery = (search.q ?? '').trim().toLowerCase()

    return videos.filter((video) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        video.title.toLowerCase().includes(normalizedQuery) ||
        video.channelTitle.toLowerCase().includes(normalizedQuery)

      const matchesSection =
        activeSection === 'All' ||
        [video.title, video.channelTitle]
          .join(' ')
          .toLowerCase()
          .includes(activeSection.toLowerCase())

      return matchesQuery && matchesSection
    })
  }, [activeSection, search.q, videos])

  return (
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
          <div className="section-heading">
            <div>
              <p className="eyebrow">Discover</p>
              <h2>What people are watching right now</h2>
            </div>
            <span className="section-meta">
              <Clock3 size={15} />
              Live from the public video API
            </span>
          </div>

          <div className="feed-toolbar">
            <div className="chip-row chip-row--toolbar">
              {exploreSections.map((section) => (
                <button
                  key={section}
                  type="button"
                  className={
                    section === activeSection ? 'filter-chip is-active' : 'filter-chip'
                  }
                  onClick={() => setActiveSection(section)}
                >
                  {section}
                </button>
              ))}
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
              <h3>The interface is ready, but the API feed did not load.</h3>
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
                  <p className="eyebrow">No matches</p>
                  <h3>Nothing matches that search yet.</h3>
                  <p>Try a softer search term or switch back to the All filter.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
