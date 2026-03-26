# Contributing to Velora

Thanks for contributing to Velora.

This project is an open-source video discovery interface built with TanStack Start, React 19, and Tailwind CSS v4. The goal is to keep the product polished, original, and easy to improve.

## Ground rules

- Keep the branding original
- Do not copy YouTube, Apple, or any other platform name into the UI
- Keep code readable and practical
- Prefer small focused pull requests over huge rewrites
- Do not commit secrets, keys, or local env files

## Before you start

1. Fork the repository
2. Clone your fork
3. Install dependencies with `bun install`
4. Copy `.env.example` to `.env.local`
5. Add your own `YOUTUBE_API_KEY` to `.env.local`
6. Start the project with `bun --bun run dev`

## Branching

Use clear branch names such as:

- `feature/watch-page-polish`
- `fix/header-search`
- `docs/readme-update`

## Code style

- Use TypeScript
- Keep component names clear
- Avoid unnecessary abstraction
- Do not add AI-sounding filler comments or weird generated code style
- Keep files focused on one responsibility when possible
- Reuse existing helpers before adding new ones

## UI expectations

- Keep the interface premium and clean
- Prefer simple, strong layouts over noisy decoration
- Make sure changes work on desktop and mobile
- Do not add clutter that pushes the core video experience too far down

## Secrets and API safety

- Never commit `.env.local`
- Never hardcode API keys in source files
- Never use `VITE_YOUTUBE_API_KEY` for this project
- Server-only keys must stay on the server
- If you think a key was exposed, rotate it immediately

## Pull requests

When opening a pull request:

1. Explain what changed
2. Explain why it changed
3. Mention any UI or behavior impact
4. Include screenshots for visual changes when possible
5. Keep the pull request focused

## Checks before submitting

Run these before opening a pull request:

- `node .\\node_modules\\typescript\\bin\\tsc --noEmit`
- `bun --bun run build`
- `bun --bun run test`

If build or test cannot run in your environment, say that clearly in the pull request.

## Good first contributions

- Visual polish
- Responsive fixes
- Watch page improvements
- Better loading and error states
- Accessibility fixes
- Documentation improvements

## Things to avoid

- Committing secrets
- Massive unrelated refactors
- Copying another platform too closely
- Adding dependencies without a real reason
- Breaking the original product direction

## Questions

If something is unclear, open an issue or a draft pull request with a short explanation of what you want to improve.
