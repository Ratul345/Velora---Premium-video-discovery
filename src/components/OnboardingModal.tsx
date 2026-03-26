import { Settings2, ThumbsDown, ThumbsUp, X } from 'lucide-react'
import {
  defaultPreferences,
  onboardingTopics,
  type UserPreferences,
} from '../lib/discover'

type OnboardingModalProps = {
  isOpen: boolean
  preferences: UserPreferences
  onToggleLike: (topic: string) => void
  onToggleDislike: (topic: string) => void
  onClose: () => void
  onReset: () => void
  isFirstRun?: boolean
}

export default function OnboardingModal({
  isOpen,
  preferences,
  onToggleLike,
  onToggleDislike,
  onClose,
  onReset,
  isFirstRun = false,
}: OnboardingModalProps) {
  if (!isOpen) {
    return null
  }

  const safePreferences = preferences ?? defaultPreferences

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <div>
            <p className="eyebrow">Tune your feed</p>
            <h2>Tell Velora what deserves your time.</h2>
            <p>
              Pick what you want more of, and block what wastes your attention.
            </p>
          </div>

          {!isFirstRun && (
            <button type="button" className="icon-link" onClick={onClose}>
              <X size={18} />
            </button>
          )}
        </div>

        <div className="onboarding-grid">
          {onboardingTopics.map((topic) => {
            const liked = safePreferences.likes.includes(topic)
            const disliked = safePreferences.dislikes.includes(topic)

            return (
              <div key={topic} className="topic-card">
                <p>{topic}</p>
                <div className="topic-card__actions">
                  <button
                    type="button"
                    className={liked ? 'topic-action is-like active' : 'topic-action is-like'}
                    onClick={() => onToggleLike(topic)}
                  >
                    <ThumbsUp size={15} />
                    Like
                  </button>
                  <button
                    type="button"
                    className={
                      disliked ? 'topic-action is-dislike active' : 'topic-action is-dislike'
                    }
                    onClick={() => onToggleDislike(topic)}
                  >
                    <ThumbsDown size={15} />
                    Skip
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="onboarding-footer">
          <div className="onboarding-summary">
            <span>
              <ThumbsUp size={14} />
              {safePreferences.likes.length} liked
            </span>
            <span>
              <ThumbsDown size={14} />
              {safePreferences.dislikes.length} blocked
            </span>
          </div>

          <div className="onboarding-footer__actions">
            <button type="button" className="watch-action-button" onClick={onReset}>
              <Settings2 size={16} />
              Reset
            </button>
            <button type="button" className="primary-cta-button" onClick={onClose}>
              Save and continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
