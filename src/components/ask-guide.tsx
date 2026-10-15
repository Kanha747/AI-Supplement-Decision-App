"use client";

import { useState } from "react";
import Link from "next/link";

type Message = { role: "you" | "guide"; text: string; related?: string[] };

export function AskGuide({ consultationId, suggestions }: { consultationId: number; suggestions: string[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState(false);

  async function ask(text: string) {
    const cleaned = text.trim();
    if (!cleaned) return;
    setQuestion("");
    setMessages((current) => [...current, { role: "you", text: cleaned }]);
    setPending(true);
    const response = await fetch("/api/consultant/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: cleaned, consultationId }),
    });
    const payload = (await response.json()) as { answer?: string; related?: string[] };
    setMessages((current) => [
      ...current,
      {
        role: "guide",
        text: payload.answer || "The library did not return an answer.",
        related: payload.related,
      },
    ]);
    setPending(false);
  }

  return (
    <section className="no-print panel p-5 md:p-6">
      <p className="eyebrow text-copper">Ask the guide</p>
      <h2 className="mt-2 text-3xl">Follow-ups stay inside the library.</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <button key={item} type="button" onClick={() => void ask(item)} className="chip text-left">
            {item}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={message.role === "you" ? "ml-8 rounded-2xl bg-sage px-4 py-3" : "mr-6 rounded-2xl bg-white px-4 py-3"}>
            <p className="text-xs uppercase tracking-widest text-muted">{message.role === "you" ? "You" : "Guide"}</p>
            <p className="mt-1 text-sm leading-6">{message.text}</p>
            {message.related?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {message.related.map((slug) => (
                  <Link key={slug} href={`/ingredients/${slug}`} className="text-xs underline">
                    {slug}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        {pending ? <p className="text-sm text-muted">Checking the monographs…</p> : null}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void ask(question);
        }}
      >
        <input
          className="field"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Why not melatonin? Is magnesium safe with levothyroxine?"
        />
        <button className="btn btn-primary text-sm" type="submit">Ask</button>
      </form>
    </section>
  );
}
