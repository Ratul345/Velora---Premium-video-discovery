import { createFileRoute } from '@tanstack/react-router'
import { MessageCircle, Share2, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { type WatchPageData, loadWatchPage } from '../../lib/video-feed'

export const Route = createFileRoute('/watch/$videoId')({
  component: WatchPage,
})

function WatchPage() {
  const { videoId } = Route.useParams()
  const [data, setData] = useState<WatchPageData | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchPage() {
      try {
        const nextData = await loadWatchPage(videoId)

        if (!cancelled) {
          setData(nextData)
          setStatus('ready')
        }
      } catch (error) {
        if (!cancelled) {
          setStatus('error')
          setErrorMessage(
            error instanceof Error ? error.message : 'Unable to load this video.',
          )
        }
      }
    }

    fetchPage()

    return () => {
      cancelled = true
    }
  }, [videoId])

  if (status === 'loading') {
    return (
      <main className="page-wrap px-4 pb-10 pt-4 lg:px-0">
        <div className="watch-layout">
          <section className="watch-main">
            <div className="watch-player-skeleton" />
            <div className="message-card mt-4">
              <p className="eyebrow">Loading</p>
              <h3>Preparing the watch page.</h3>
              <p>Pulling video details, comments, and related picks.</p>
            </div>
          </section>
        </div>
      </main>
    )
  }

  if (status === 'error' || !data) {
    return (
      <main className="page-wrap px-4 pb-10 pt-4 lg:px-0">
        <div className="message-card">
          <p className="eyebrow">Watch page unavailable</p>
          <h3>This video could not be loaded.</h3>
          <p>{errorMessage}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="page-wrap px-4 pb-10 pt-4 lg:px-0">
      <div className="watch-layout">
        <section className="watch-main">
          <div className="watch-player-frame">
            <iframe
              src={data.video.embedUrl}
              title={data.video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="watch-heading mt-4">
            <h1>{data.video.title}</h1>
            <p>
              {data.video.views} · {data.video.published}
            </p>
          </div>

          <div className="watch-meta-bar">
            <div className="watch-channel">
              <img
                src={data.video.channelImage}
                alt={data.video.channelTitle}
                className="avatar-image"
              />
              <div>
                <strong>{data.video.channelTitle}</strong>
                <span>{data.video.subscriberCount}</span>
              </div>
            </div>

            <div className="watch-actions">
              <button type="button" className="watch-action-button">
                <ThumbsUp size={16} />
                {data.video.likeCount}
              </button>
              <button type="button" className="watch-action-button">
                <ThumbsDown size={16} />
                Dislike
              </button>
              <button type="button" className="watch-action-button">
                <Share2 size={16} />
                Share
              </button>
              <button type="button" className="watch-action-button">
                <MessageCircle size={16} />
                {data.video.commentCount}
              </button>
            </div>
          </div>

          <div className="watch-description">
            <p>{data.video.description}</p>
          </div>

          <section className="watch-comments">
            <div className="section-heading watch-section-heading">
              <div>
                <p className="eyebrow">Comments</p>
                <h2>What viewers are saying</h2>
              </div>
            </div>

            {data.comments.length === 0 ? (
              <div className="message-card">
                <p>No public comments are available for this video.</p>
              </div>
            ) : (
              <div className="watch-comment-list">
                {data.comments.map((comment) => (
                  <article key={comment.id} className="watch-comment-card">
                    <img
                      src={comment.authorImage}
                      alt={comment.author}
                      className="watch-comment-avatar"
                    />
                    <div>
                      <p className="watch-comment-author">
                        {comment.author} <span>{comment.published}</span>
                      </p>
                      <p className="watch-comment-text">{comment.text}</p>
                      <span className="watch-comment-likes">{comment.likes}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>

        <aside className="watch-sidebar">
          <div className="section-heading watch-section-heading">
            <div>
              <p className="eyebrow">Up next</p>
              <h2>Related videos</h2>
            </div>
          </div>

          <div className="related-video-list">
            {data.relatedVideos.map((video) => (
              <a key={video.id} href={`/watch/${video.id}`} className="related-video-card">
                <div className="related-video-thumb-wrap">
                  <img src={video.thumbnail} alt={video.title} className="thumb-image" />
                  <span className="duration-pill">{video.duration}</span>
                </div>
                <div className="related-video-copy">
                  <h3>{video.title}</h3>
                  <p>{video.channelTitle}</p>
                  <span>
                    {video.views} · {video.published}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}
