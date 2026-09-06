import { buildCensus, type Census } from "./census";
import { getGithubProfile } from "./github";

export async function loadCensus(login: string): Promise<Census> {
  const bundle = await getGithubProfile(login);
  return buildCensus(bundle.user, bundle.repos, {
    catchphrase: bundle.catchphrase,
    weaponRepo: bundle.weaponRepo,
  });
}
