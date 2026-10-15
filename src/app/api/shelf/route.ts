import { db } from "@/db";
import { shelfItems } from "@/db/schema";
import { getOrCreateSessionId, readSessionId } from "@/lib/session";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    kind?: string;
    ref?: string;
    title?: string;
    subtitle?: string;
    href?: string;
  } | null;
  if (!body?.kind || !body.ref || !body.title || !body.href) {
    return Response.json({ error: "Missing shelf fields." }, { status: 400 });
  }
  if (!["ingredient", "product", "label"].includes(body.kind)) {
    return Response.json({ error: "Unknown shelf kind." }, { status: 400 });
  }
  const sessionId = await getOrCreateSessionId();
  await db
    .insert(shelfItems)
    .values({
      sessionId,
      kind: body.kind,
      ref: body.ref.slice(0, 80),
      title: body.title.slice(0, 160),
      subtitle: (body.subtitle ?? "").slice(0, 160),
      href: body.href.slice(0, 180),
    })
    .onConflictDoNothing();
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const sessionId = await readSessionId();
  if (!sessionId) return Response.json({ error: "No shelf session." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { id?: number } | null;
  if (!body?.id) return Response.json({ error: "Missing id." }, { status: 400 });
  await db.delete(shelfItems).where(and(eq(shelfItems.id, body.id), eq(shelfItems.sessionId, sessionId)));
  return Response.json({ ok: true });
}
