"use client";

import { useState } from "react";

type SavePayload = {
  kind: string;
  ref: string;
  title: string;
  subtitle: string;
  href: string;
};

export function SaveButton({ item, tone = "ghost" }: { item: SavePayload; tone?: "ghost" | "primary" }) {
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");

  async function save() {
    setState("idle");
    const response = await fetch("/api/shelf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    setState(response.ok ? "saved" : "error");
  }

  return (
    <button type="button" onClick={save} className={`btn ${tone === "primary" ? "btn-primary" : "btn-ghost"} text-sm`}>
      {state === "saved" ? "Saved to shelf" : state === "error" ? "Try again" : "Save to shelf"}
    </button>
  );
}

export function RemoveShelfButton({ id }: { id: number }) {
  const [pending, setPending] = useState(false);

  async function remove() {
    setPending(true);
    await fetch("/api/shelf", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    window.location.reload();
  }

  return (
    <button type="button" onClick={remove} disabled={pending} className="text-sm text-copper underline">
      {pending ? "Removing" : "Remove"}
    </button>
  );
}
