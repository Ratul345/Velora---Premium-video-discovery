import { createFileRoute } from '@tanstack/react-router'
import { Code2, LockKeyhole, Palette } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="page-wrap px-4 py-10 lg:px-0">
      <section className="about-shell">
        <p className="eyebrow">About Velora</p>
        <h1>A video platform mood that feels more refined than the usual feed.</h1>
        <p className="about-lead">
          Velora is built around one idea: keep the ease people already know,
          then improve the taste, pacing, and discovery so the whole experience
          feels less noisy and more worth spending time in.
        </p>
      </section>

      <section className="about-grid">
        <article className="about-card">
          <Palette size={20} />
          <h2>Visual direction</h2>
          <p>
            Deep contrast, soft glass, careful spacing, and stronger typography
            make the interface feel richer without turning it into a costume.
          </p>
        </article>

        <article className="about-card">
          <Code2 size={20} />
          <h2>Discovery first</h2>
          <p>
            The real win is not just the look. It is the feeling that each row,
            card, and interaction pushes you toward better choices faster.
          </p>
        </article>

        <article className="about-card">
          <LockKeyhole size={20} />
          <h2>Ready to publish</h2>
          <p>
            Do not commit real keys. Keep `.env.local` local, add an example env
            file, and lock the video API key to approved referrers before you go public.
          </p>
        </article>
      </section>
    </main>
  )
}
