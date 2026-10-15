import { parseProfile } from "@/data/consultant-options";
import { buildConsultation, saveConsultation } from "@/lib/consultant";
import { getOrCreateSessionId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = parseProfile(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }
  const result = await buildConsultation(parsed.profile);
  const sessionId = await getOrCreateSessionId();
  const id = await saveConsultation(sessionId, parsed.profile, result);
  if (!id) {
    return Response.json({ error: "The note could not be saved." }, { status: 500 });
  }
  return Response.json({ id });
}
