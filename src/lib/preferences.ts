import { defaultPreferences, type UserPreferences } from './discover'

const STORAGE_KEY = 'velora-user-preferences'

export function readStoredPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return defaultPreferences
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return defaultPreferences
    }

    const parsed = JSON.parse(raw) as Partial<UserPreferences>

    return {
      likes: Array.isArray(parsed.likes) ? parsed.likes.filter(isString) : [],
      dislikes: Array.isArray(parsed.dislikes)
        ? parsed.dislikes.filter(isString)
        : [],
    }
  } catch {
    return defaultPreferences
  }
}

export function saveStoredPreferences(preferences: UserPreferences) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
}

export function hasMeaningfulPreferences(preferences: UserPreferences) {
  return preferences.likes.length > 0 || preferences.dislikes.length > 0
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}
