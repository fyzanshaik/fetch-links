## Fetch Links

A tiny Next.js + Bun app to extract links (and titles) from any YouTube playlist and copy them in one go.

### Features
- Fetch all video URLs from a playlist
- Also fetch video titles
- Copy in either format:
  - "Name:  Link:" per line
  - Links only
- Server Actions for fast, server-side work
- Bubblegum theme, responsive UI, copy toasts and subtle button animations

### Getting Started

Dev server (Bun):

```bash
bun run dev
```

Open `http://localhost:3000`.

Optional: Create `.env.local` to use YouTube Data API v3 for large playlists and more reliable fetching.

```bash
YOUTUBE_API_KEY=YOUR_API_KEY_HERE
```

When the key is present, the app uses the official API first and falls back to scraping only if the API request fails.

### How it works
- Server-side logic in `lib/playlist.ts` gathers `{ title, url }` for each video.
- API route `app/api/playlist/route.ts` is available for programmatic access.
- UI uses a server action (`app/actions.ts`) to fetch results on submit.
- Copy buttons show a small toast and a brief pulse ring animation to confirm copy.

### Notes
- Scraping can break if YouTube markup changes; using the API key is recommended.
- No data is stored; requests are processed server-side per submit.

### Deploy
You can deploy anywhere Next.js runs (Vercel, Fly, etc.). On Vercel, set `YOUTUBE_API_KEY` in project environment variables if you want API usage.

---

Made by [@fyzanshaik](https://github.com/fyzanshaik) · Twitter: [@fyzanshaik](https://twitter.com/fyzanshaik)
