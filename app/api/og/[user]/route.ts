import { parseGithubLogin } from "@/lib/username";
import { loadCensus } from "@/lib/load";
import { GithubError } from "@/lib/github";

export const revalidate = 3600;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ user: string }> },
) {
  const { user } = await params;
  const login = parseGithubLogin(user);
  if (!login) return new Response("need a github username", { status: 400 });
  try {
    const census = await loadCensus(login);
    const { card } = census;
    const stats = card.stats
      .map((s, i) => {
        const x = 520 + (i % 3) * 200;
        const y = 360 + Math.floor(i / 3) * 110;
        return `<text x="${x}" y="${y}" fill="#8b93b3" font-size="16" font-family="ui-monospace, monospace">${s.key}</text>
          <text x="${x}" y="${y + 42}" fill="#ffffff" font-size="40" font-family="Arial, sans-serif">${s.value}</text>`;
      })
      .join("");

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#07080f"/>
  <rect x="48" y="48" width="420" height="534" rx="28" fill="#12141f" stroke="#f5d76e" stroke-width="3"/>
  <image href="${escapeXml(census.user.avatar)}" x="78" y="120" width="360" height="360" preserveAspectRatio="xMidYMid slice"/>
  <text x="78" y="100" fill="#ffffff" font-size="56" font-family="Arial, sans-serif">${card.overall}</text>
  <text x="200" y="92" fill="#5ce1ff" font-size="20" font-family="ui-monospace, monospace">${escapeXml(card.role)}</text>
  <text x="78" y="520" fill="#ffffff" font-size="28" font-family="Arial, sans-serif">${escapeXml(census.user.name.toUpperCase().slice(0, 22))}</text>
  <text x="78" y="552" fill="#8b93b3" font-size="16" font-family="ui-monospace, monospace">@${escapeXml(census.user.login)}</text>
  <text x="520" y="100" fill="#b7ff3c" font-size="18" font-family="ui-monospace, monospace">POWER SCOUTER</text>
  <text x="520" y="170" fill="#ffffff" font-size="48" font-family="Arial, sans-serif">${escapeXml(census.user.name)}</text>
  <text x="520" y="220" fill="#9aa4c7" font-size="22" font-family="Arial, sans-serif">@${escapeXml(census.user.login)} · ${escapeXml(card.role)}</text>
  <text x="520" y="280" fill="#b7ff3c" font-size="36" font-family="ui-monospace, monospace">${card.powerLevel.toLocaleString()} KI</text>
  ${stats}
</svg>`;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    const status = err instanceof GithubError ? err.status : 500;
    return new Response("card failed", { status });
  }
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
