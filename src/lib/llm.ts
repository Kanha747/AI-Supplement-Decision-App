type PolishInput = {
  narrative: string[];
  facts: unknown;
};

export async function polishNarrative({ narrative, facts }: PolishInput) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You edit Evidra consultation notes. Rewrite the draft so it sounds calm, specific, and human. Do not add supplements, doses, citations, diagnoses, or claims that are not in the source brief. Keep the statement that this is educational and not medical advice. Return only plain paragraphs separated by blank lines.",
          },
          {
            role: "user",
            content: `SOURCE BRIEF:\n${JSON.stringify(facts)}\n\nDRAFT:\n${narrative.join("\n\n")}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) return null;
    const paragraphs = text
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    return paragraphs.length ? paragraphs : null;
  } catch {
    return null;
  }
}
