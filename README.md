# Velora - Premium Video Discovery Interface

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-latest-FF4154.svg)](https://tanstack.com/start)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4.svg)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/runtime-Bun-FBF0DF.svg)](https://bun.sh/)

**Velora** is an open-source **video discovery interface** built with **React 19, TanStack Start, TypeScript, and Tailwind CSS v4**. It is designed as a premium alternative to typical video platform clones, with an original visual identity, focused watch experience, smooth discovery flow, and a clean architecture that can be extended to other content sources.

> **Velora is a frontend and discovery experience, not a YouTube clone.** The interface and branding are original. YouTube is currently used as the content source through the YouTube Data API.

## Why Velora?

Most video-platform demo projects focus on reproducing an existing product. Velora takes a different approach: build a distinctive video discovery product from the ground up.

The project explores how a modern React application can combine:

- A premium, original video discovery UI
- A clean and focused video-watching surface
- Fast navigation and responsive interactions
- Server-side API handling for protected credentials
- A maintainable TypeScript architecture
- A content-source layer that can evolve beyond YouTube

## Features

- **Original video discovery interface** with a custom brand and visual direction
- **YouTube-powered discovery feed** using the YouTube Data API
- **Server-side API proxy** through `src/routes/api/discover.ts`
- **Protected API credentials** so the YouTube API key is not bundled into browser-side code
- **Responsive UI** designed for desktop and smaller screens
- **Modern React architecture** using React 19 and TanStack Start
- **Tailwind CSS v4** for the styling system
- **TypeScript** throughout the application
- **Lucide React** icons
- **Separated feed logic** for easier API and content-source changes
- **Simple project structure** that is easy to understand and extend

## Tech Stack

| Technology | Purpose |
| --- | --- |
| [React 19](https://react.dev/) | UI and application components |
| [TanStack Start](https://tanstack.com/start) | Full-stack React application framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe application development |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling and visual system |
| [Lucide React](https://lucide.dev/) | Interface icons |
| [YouTube Data API](https://developers.google.com/youtube/v3) | Video discovery data source |
| [Bun](https://bun.sh/) | JavaScript runtime and package manager |

## Architecture

Velora keeps the client and server responsibilities separated.

```text
Browser
  |
  | fetch video discovery data
  v
/src/lib/video-feed.ts
  |
  | request
  v
/src/routes/api/discover.ts
  |
  | server-side API request
  v
YouTube Data API
  |
  v
/src/lib/youtube-feed.ts
  |
  v
Normalized video data
  |
  v
Velora discovery UI
```

The browser communicates with Velora's own server route instead of directly exposing the YouTube API key. This keeps the credential server-side and gives the project a clean boundary for replacing or adding content providers later.

## Project Structure

```text
src/
├── routes/
│   ├── index.tsx              # Home and video discovery interface
│   ├── about.tsx              # About page
│   └── api/
│       └── discover.ts        # Server-side video discovery endpoint
├── lib/
│   ├── video-feed.ts          # Client-side feed request helper
│   ├── youtube-feed.ts        # YouTube API formatting and mapping
│   └── discover.ts             # Static discovery/navigation content
└── styles.css                 # Global styles and visual system
```

## Getting Started

### Prerequisites

Make sure you have:

- [Bun](https://bun.sh/) installed
- A YouTube Data API v3 key

### 1. Clone the repository

```bash
git clone https://github.com/Ratul345/Velora---Premium-video-discovery.git
cd Velora---Premium-video-discovery
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Add your YouTube API key to `.env.local`:

```env
YOUTUBE_API_KEY=your_key_here
```

### 4. Start the development server

```bash
bun --bun run dev
```

Open the local development URL shown by the terminal.

## Environment Variables

Velora currently uses one server-side environment variable:

| Variable | Description |
| --- | --- |
| `YOUTUBE_API_KEY` | API key used by the server-side discovery endpoint |

### Important security note

Do **not** use `VITE_YOUTUBE_API_KEY` for this project.

Vite exposes variables prefixed with `VITE_` to client-side application code. The YouTube API key should remain server-side and be accessed only by the server route.

Also:

- Keep `.env.local` out of version control
- Never commit real API credentials
- Keep `.env.example` free of secrets
- Restrict your API key where supported
- Set appropriate API usage limits
- Rotate the key immediately if it is accidentally exposed

## Available Scripts

```bash
bun --bun run dev
bun --bun run build
bun --bun run test
```

## YouTube Data API

Velora currently uses the **YouTube Data API v3** as its video discovery source. The integration is intentionally separated from the UI so the application can evolve without tightly coupling the interface to one external API.

The main integration points are:

- `src/routes/api/discover.ts` - server-side API endpoint
- `src/lib/youtube-feed.ts` - YouTube response formatting and mapping
- `src/lib/video-feed.ts` - client-side feed request helper

## Open Source

Velora is released under the **MIT License**, making it suitable for learning, experimentation, modification, and building upon the project according to the license terms.

Contributions, bug reports, ideas, and improvements are welcome.

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the available tests and checks
5. Open a pull request

Please keep contributions focused, readable, accessible, and consistent with the existing architecture and design direction.

## Roadmap

Potential future improvements include:

- More discovery categories and filtering
- Improved search and recommendation flows
- Additional video and media sources
- Better loading and error states
- More advanced personalization
- Expanded accessibility improvements
- Performance and caching improvements

## Keywords

`video discovery` · `video discovery interface` · `video platform UI` · `React video app` · `React 19` · `TanStack Start` · `Tailwind CSS v4` · `TypeScript` · `YouTube Data API` · `YouTube API` · `video streaming UI` · `video feed` · `open source React project` · `modern React application` · `premium web UI`

## License

This project is licensed under the [MIT License](LICENSE).

## Links

- **Repository:** https://github.com/Ratul345/Velora---Premium-video-discovery
- **YouTube Data API:** https://developers.google.com/youtube/v3
- **TanStack Start:** https://tanstack.com/start
- **React:** https://react.dev/
- **Tailwind CSS:** https://tailwindcss.com/
