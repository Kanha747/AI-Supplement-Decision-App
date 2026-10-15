import Link from "next/link";
import { RemoveShelfButton } from "@/components/save-button";
import { db } from "@/db";
import { shelfItems } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { readSessionId } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ShelfPage() {
  const sessionId = await readSessionId();
  const items: Array<typeof shelfItems.$inferSelect> = sessionId
    ? (await db.select().from(shelfItems).where(eq(shelfItems.sessionId, sessionId)).orderBy(desc(shelfItems.createdAt))) as Array<typeof shelfItems.$inferSelect>
    : [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <p className="eyebrow text-copper">Shelf</p>
      <h1 className="mt-2 text-5xl">Saved for a slower read.</h1>
      <p className="mt-3 text-[#3d4f46]">Saved on this browser. Nothing here is an account, and nothing is a recommendation by itself.</p>
      {!items.length ? (
        <div className="panel mt-8 p-6">
          <p>The shelf is empty.</p>
          <div className="mt-4 flex gap-3">
            <Link href="/ingredients" className="btn btn-primary">Library</Link>
            <Link href="/scan" className="btn btn-ghost">Scan</Link>
          </div>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="panel flex items-center justify-between gap-4 p-4">
              <Link href={item.href}>
                <p className="text-xs uppercase tracking-widest text-muted">{item.kind} · {item.subtitle}</p>
                <p className="font-display text-2xl">{item.title}</p>
              </Link>
              <RemoveShelfButton id={item.id} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
