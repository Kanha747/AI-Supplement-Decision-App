import { answerQuestion, getConsultation } from "@/lib/consultant";
import type { ConsultationResult } from "@/lib/consultant";
import { readSessionId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { question?: string; consultationId?: number } | null;
  const question = body?.question ?? "";
  const sessionId = await readSessionId();
  let consultation: ConsultationResult | null = null;
  if (sessionId && body?.consultationId) {
    const row = await getConsultation(Number(body.consultationId), sessionId);
    const value = row?.recommendations;
    if (value && typeof value === "object" && Array.isArray((value as ConsultationResult).recommendations)) {
      consultation = value as ConsultationResult;
    }
  }
  const answer = await answerQuestion(question, consultation);
  return Response.json(answer);
}
