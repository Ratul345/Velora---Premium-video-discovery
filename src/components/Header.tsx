import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { Compass, Github, MoonStar, Play, Search } from 'lucide-react'
import { startTransition, useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'

type HeaderSearch = {
  q?: string
}

export default function Header() {
  const navigate = useNavigate()
  const location = useRouterState({
    select: (state) => ({
      pathname: state.location.pathname,
      search: state.location.search as HeaderSearch,
    }),
  })
  const [query, setQuery] = useState(location.search.q ?? '')

  useEffect(() => {
    setQuery(location.search.q ?? '')
  }, [location.search.q])

  function updateSearch(nextQuery: string) {
    setQuery(nextQuery)

    startTransition(() => {
      navigate({
        to: '/',
        search: (prev) => ({
          ...(typeof prev === 'object' && prev ? prev : {}),
          q: nextQuery.trim() ? nextQuery : undefined,
        }),
        replace: true,
      })
    })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-xl">
      <nav className="page-wrap header-shell py-3 md:py-4">
        <Link
          to="/"
          className="brand-mark no-underline"
          aria-label="Velora home"
        >
          <span className="brand-mark__glyph">
            <Play size={14} strokeWidth={2.4} fill="currentColor" />
          </span>
          <span>
            <strong>Velora</strong>
            <small>moving stories</small>
          </span>
        </Link>

        <div className="header-search" role="search">
          <Search size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Search"
            aria-label="Search videos"
          />
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/"
            className="nav-pill"
            activeProps={{ className: 'nav-pill is-active' }}
          >
            <Compass size={16} />
            Discover
          </Link>
          <Link
            to="/about"
            className="nav-pill"
            activeProps={{ className: 'nav-pill is-active' }}
          >
            <MoonStar size={16} />
            About
          </Link>
        </div>

        <div className="header-actions flex items-center gap-2 lg:ml-0">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="icon-link"
            aria-label="Open GitHub"
          >
            <Github size={18} />
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
