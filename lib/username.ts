/** Pull a GitHub login out of a username, @handle, or full profile URL. */
export function parseGithubLogin(raw: string): string | null {
  let s = raw.trim();
  if (!s) return null;
  try {
    s = decodeURIComponent(s);
  } catch {
    /* already decoded */
  }
  s = s.replace(/^@+/, "").trim();

  const urlish = s.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#\s]+)/i);
  if (urlish) {
    const piece = urlish[1].replace(/\/+$/, "");
    if (isLogin(piece)) return piece;
    return null;
  }

  // people paste github.com/name without scheme
  if (/^github\.com\//i.test(s)) {
    const piece = s.split("/")[1] ?? "";
    return isLogin(piece) ? piece : null;
  }

  return isLogin(s) ? s : null;
}

function isLogin(value: string) {
  return /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(value) || /^[A-Za-z0-9]$/.test(value);
}
