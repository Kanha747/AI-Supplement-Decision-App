"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "evidra-compare";

type Item = { slug: string; name: string };

function read(): Item[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]") as Item[];
    return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
  } catch {
    return [];
  }
}

function write(items: Item[]) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 3)));
  window.dispatchEvent(new Event("evidra-compare"));
}

export function CompareToggle({ slug, name }: { slug: string; name: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sync = () => setOn(read().some((item) => item.slug === slug));
    sync();
    window.addEventListener("evidra-compare", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("evidra-compare", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  function toggle() {
    const current = read();
    if (current.some((item) => item.slug === slug)) {
      write(current.filter((item) => item.slug !== slug));
      return;
    }
    if (current.length >= 3) {
      write([...current.slice(1), { slug, name }]);
      return;
    }
    write([...current, { slug, name }]);
  }

  return (
    <button type="button" onClick={toggle} className="btn btn-ghost text-sm">
      {on ? "In compare" : "Compare"}
    </button>
  );
}

export function CompareTray() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener("evidra-compare", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("evidra-compare", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!items.length) return null;
  const href = `/compare?items=${items.map((item) => item.slug).join(",")}`;

  return (
    <div className="no-print fixed inset-x-0 bottom-16 z-30 mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-full border border-line bg-ink px-4 py-3 text-[#f6f1e8] shadow-2xl md:bottom-6">
      <p className="truncate text-sm">
        Compare {items.map((item) => item.name).join(" · ")}
      </p>
      <div className="flex shrink-0 items-center gap-3">
        <button type="button" onClick={() => write([])} className="text-xs text-[#d9c3ae]">
          Clear
        </button>
        <Link href={href} className="btn btn-copper px-3 py-2 text-sm">
          Open
        </Link>
      </div>
    </div>
  );
}
