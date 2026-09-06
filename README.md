# Scouter

Scan a GitHub username. Get a holographic anime card, a ki reading, traits, and 1,000 extras.

Built by [Arsal Adnan](https://github.com/Lunarfang08) (`@Lunarfang08`).

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000 — try `/c/Lunarfang08`.

Also:

- Duel: `/duel/Lunarfang08/torvalds`
- Fusion: `/fuse/Lunarfang08/gaearon`
- Squad: `/c/Lunarfang08?squad=2,5,8,12`

The card shows village (from GitHub location), catchphrase (last public commit), and a weapon named after a pinned/top repo. Tap the scouter for beeps.

## GitHub token

For a public deploy, add `GITHUB_TOKEN` (classic token, no scopes required) so you are not stuck at 60 requests/hour.

## License

MIT
