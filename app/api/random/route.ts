import { pickRandomGithubLogin } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const exclude = searchParams.getAll("exclude").filter(Boolean);
  const login = await pickRandomGithubLogin(exclude);
  return Response.json(
    { login },
    { headers: { "Cache-Control": "no-store" } },
  );
}
