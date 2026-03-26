# Velora

Velora is an open-source video discovery interface built with TanStack Start, React 19, and Tailwind CSS v4. It focuses on a cleaner watch surface, a tighter discovery flow, and a premium visual tone without copying another platform's identity.

## Features

- Original brand and interface direction
- Video discovery feed powered by the YouTube Data API
- Server-side API proxy so your real key is not shipped to the browser
- Fast UI built with React 19, TanStack Start, and Tailwind CSS v4
- Simple file structure that is easy to extend

## Tech stack

- TanStack Start
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React

## Getting started

1. Install dependencies:
   `bun install`
2. Copy the example env file:
   `cp .env.example .env.local`
3. Add your server-only key to `.env.local`:
   `YOUTUBE_API_KEY=your_key_here`
4. Start the dev server:
   `bun --bun run dev`

## Environment variables

This project uses a server-side environment variable:

- `YOUTUBE_API_KEY`
  Used by the server route at `src/routes/api/discover.ts`.
  This key is not exposed to the client bundle.

Do not use `VITE_YOUTUBE_API_KEY` for this project.
Anything prefixed with `VITE_` is exposed to the browser by Vite.

## Open source safety

- `.env.local` is ignored by Git and should never be committed
- Use a restricted API key with referrer and API limits where possible
- If a key has ever been shown publicly, rotate it before publishing the repo
- Keep `.env.example` free of real secrets

## Scripts

- `bun --bun run dev`
- `bun --bun run build`
- `bun --bun run test`

## Project structure

- `src/routes/index.tsx` home feed UI
- `src/routes/about.tsx` about page
- `src/routes/api/discover.ts` server endpoint for the video feed
- `src/lib/video-feed.ts` client fetch helper
- `src/lib/youtube-feed.ts` YouTube API formatting and mapping logic
- `src/lib/discover.ts` static navigation content
- `src/styles.css` visual system and layout styles

## Contributing

Contributions are welcome.

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run tests and checks
5. Open a pull request

Please keep changes focused, readable, and consistent with the existing style.

## Notes

This project currently uses the YouTube Data API as the content source, but the UI and branding are original.
