"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type LocalHit = {
  slug: string;
  name: string;
  brand: string;
  form: string;
  clarity: number;
};

type DsldHit = {
  id: string;
  name: string;
  brand: string;
  form: string;
  offMarket: boolean;
  productType: string;
};

type FoodHit = {
  name: string;
  brand: string;
  categories: string;
  image?: string;
  url: string;
};

type Lookup = {
  code: string;
  local: LocalHit | null;
  dsld: DsldHit[];
  food: FoodHit | null;
  error?: string;
};

const demos = [
  { code: "850123400016", name: "Northline D3 2,000 IU" },
  { code: "850123400047", name: "Keel creatine, 5 g" },
  { code: "850123400054", name: "Marlow sleep gummy" },
  { code: "850123401013", name: "Marlow prenatal" },
  { code: "850123401020", name: "Underdosed turmeric gummy" },
  { code: "850123401068", name: "Proprietary focus blend" },
];

declare class BarcodeDetector {
  constructor(options?: { formats?: string[] });
  static getSupportedFormats?: () => Promise<string[]>;
  detect(source: CanvasImageSource): Promise<{ rawValue: string }[]>;
}

export function Scanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [manual, setManual] = useState("");
  const [status, setStatus] = useState("Camera stays off until you start it.");
  const [live, setLive] = useState(false);
  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      controlsRef.current?.stop();
      const stream = video?.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  async function lookupCode(raw: string) {
    const code = raw.replace(/\D/g, "");
    if (code.length < 6) {
      setStatus("Enter at least 6 digits.");
      return;
    }
    setPending(true);
    setStatus(`Looking up ${code}`);
    const response = await fetch(`/api/barcode?code=${code}`);
    const payload = (await response.json()) as Lookup;
    setLookup(payload);
    setPending(false);
    setStatus(payload.local || payload.dsld?.length || payload.food ? `Found a record for ${code}.` : `No curated or NIH label for ${code}.`);
    const recent = JSON.parse(localStorage.getItem("evidra-scans") || "[]") as string[];
    localStorage.setItem("evidra-scans", JSON.stringify([code, ...recent.filter((item) => item !== code)].slice(0, 5)));
  }

  async function start() {
    setStatus("Requesting the camera…");
    setLive(true);
    const video = videoRef.current;
    if (!video) return;
    try {
      if ("BarcodeDetector" in window) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        video.srcObject = stream;
        await video.play();
        const detector = new BarcodeDetector({
          formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "qr_code"],
        });
        let stopped = false;
        controlsRef.current = {
          stop() {
            stopped = true;
            stream.getTracks().forEach((track) => track.stop());
          },
        };
        const tick = async () => {
          if (stopped) return;
          try {
            const codes = await detector.detect(video);
            if (codes[0]?.rawValue) {
              stopped = true;
              stream.getTracks().forEach((track) => track.stop());
              setLive(false);
              await lookupCode(codes[0].rawValue);
              return;
            }
          } catch {
            // Keep scanning. A single frame can fail without ending the session.
          }
          requestAnimationFrame(() => void tick());
        };
        setStatus("Point the camera at a barcode.");
        void tick();
        return;
      }

      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      controlsRef.current = await reader.decodeFromConstraints(
        { video: { facingMode: { ideal: "environment" } } },
        video,
        (result) => {
          if (!result) return;
          controlsRef.current?.stop();
          setLive(false);
          void lookupCode(result.getText());
        },
      );
      setStatus("Point the camera at a barcode.");
    } catch {
      setLive(false);
      setStatus("Camera unavailable. Type a barcode or try one of the demo labels.");
    }
  }

  function stop() {
    controlsRef.current?.stop();
    setLive(false);
    setStatus("Camera off.");
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setStatus("Reading the image…");
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      const url = URL.createObjectURL(file);
      const result = await reader.decodeFromImageUrl(url);
      URL.revokeObjectURL(url);
      await lookupCode(result.getText());
    } catch {
      setStatus("No barcode found in that image. Try a closer photo or type the digits.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="panel overflow-hidden">
        <div className="relative aspect-[4/3] bg-moss-deep">
          <video ref={videoRef} className={`h-full w-full object-cover ${live ? "opacity-100" : "opacity-30"}`} muted playsInline />
          <div className="pointer-events-none absolute inset-8 rounded-3xl border-2 border-dashed border-white/70" />
          <p className="absolute bottom-4 left-4 right-4 text-sm text-white">{status}</p>
        </div>
        <div className="flex flex-wrap gap-3 p-4">
          {live ? (
            <button type="button" onClick={stop} className="btn btn-ghost text-sm">Stop camera</button>
          ) : (
            <button type="button" onClick={start} className="btn btn-primary text-sm">Start camera</button>
          )}
          <label className="btn btn-ghost cursor-pointer text-sm">
            Upload a photo
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => void onFile(event.target.files?.[0])} />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <form
          className="panel p-4"
          onSubmit={(event) => {
            event.preventDefault();
            void lookupCode(manual);
          }}
        >
          <label className="eyebrow text-muted" htmlFor="barcode">Barcode</label>
          <div className="mt-3 flex gap-2">
            <input
              id="barcode"
              inputMode="numeric"
              value={manual}
              onChange={(event) => setManual(event.target.value)}
              placeholder="850123400016"
              className="field"
            />
            <button className="btn btn-copper text-sm" type="submit" disabled={pending}>
              {pending ? "…" : "Look up"}
            </button>
          </div>
        </form>

        <div className="panel p-4">
          <p className="eyebrow text-muted">Demo labels</p>
          <div className="mt-3 grid gap-2">
            {demos.map((demo) => (
              <button
                key={demo.code}
                type="button"
                onClick={() => {
                  setManual(demo.code);
                  void lookupCode(demo.code);
                }}
                className="flex items-center justify-between rounded-2xl border border-line bg-white/60 px-3 py-3 text-left text-sm hover:border-moss"
              >
                <span>{demo.name}</span>
                <span className="font-mono text-xs text-muted">{demo.code}</span>
              </button>
            ))}
          </div>
        </div>

        {lookup ? <LookupCard lookup={lookup} /> : null}
      </div>
    </div>
  );
}

function LookupCard({ lookup }: { lookup: Lookup }) {
  return (
    <div className="panel p-4">
      <p className="eyebrow text-muted">Result · {lookup.code}</p>
      {lookup.local ? (
        <Link href={`/products/${lookup.local.slug}`} className="mt-3 block rounded-2xl bg-ink p-4 text-[#f6f1e8]">
          <p className="text-xs uppercase tracking-widest text-[#e7c7a4]">Curated review</p>
          <p className="mt-1 font-display text-2xl">{lookup.local.name}</p>
          <p className="text-sm text-[#d5e0d8]">{lookup.local.brand} · {lookup.local.form} · clarity {lookup.local.clarity}</p>
        </Link>
      ) : null}
      {lookup.dsld?.length ? (
        <ul className="mt-3 space-y-2">
          {lookup.dsld.map((hit) => (
            <li key={hit.id}>
              <Link href={`/labels/${hit.id}`} className="block rounded-2xl border border-line px-3 py-3 hover:border-moss">
                <p className="text-xs uppercase tracking-widest text-copper">NIH label {hit.id}</p>
                <p className="font-semibold">{hit.name}</p>
                <p className="text-sm text-muted">{hit.brand} · {hit.form}{hit.offMarket ? " · off market" : ""}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {lookup.food ? (
        <a href={lookup.food.url} target="_blank" rel="noreferrer" className="mt-3 block rounded-2xl border border-line p-3">
          <p className="text-xs uppercase tracking-widest text-muted">Open Food Facts · food, not a supplement monograph</p>
          <p className="font-semibold">{lookup.food.name}</p>
          <p className="text-sm text-muted">{lookup.food.brand}</p>
        </a>
      ) : null}
      {!lookup.local && !lookup.dsld?.length && !lookup.food ? (
        <p className="mt-3 text-sm leading-6 text-muted">Nothing matched. Try a demo code, or search the ingredient by name.</p>
      ) : null}
    </div>
  );
}
