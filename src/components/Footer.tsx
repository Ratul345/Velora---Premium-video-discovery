import { Link } from '@tanstack/react-router'
import { Github, HeartHandshake } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer mt-18 px-4 pb-12 pt-8">
      <div className="page-wrap flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="footer-label">Velora</p>
          <p className="m-0 max-w-xl text-sm text-[var(--text-soft)]">
            A premium video space built to feel more selective, more elegant,
            and less chaotic than the usual feed.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link to="/about" className="footer-link">
            About Velora
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            <Github size={16} />
            Source code
          </a>
          <span className="footer-link footer-link--static">
            <HeartHandshake size={16} />
            Built for discovery
          </span>
        </div>
      </div>

      <div className="page-wrap mt-6 flex flex-col gap-2 border-t border-[var(--line)] pt-5 text-sm text-[var(--text-soft)] sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0">&copy; {year} Velora. Crafted for discovery.</p>
        <p className="m-0">Keep secrets out of Git. Share the product, not the keys.</p>
      </div>
    </footer>
  )
}
