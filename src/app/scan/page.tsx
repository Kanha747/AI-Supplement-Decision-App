import type { Metadata } from "next";
import { Scanner } from "@/components/scanner";

export const metadata: Metadata = { title: "Scan a barcode" };

export default function ScanPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <p className="eyebrow text-copper">Barcode desk</p>
      <h1 className="mt-2 max-w-3xl text-5xl leading-tight">Point, type, or borrow a demo label.</h1>
      <p className="mt-3 max-w-2xl text-lg leading-8 text-[#3d4f46]">
        Curated teaching barcodes open a full Evidra review. Any other code is checked against the NIH Dietary Supplement Label Database, then Open Food Facts if it is a food.
      </p>
      <div className="mt-8">
        <Scanner />
      </div>
    </main>
  );
}
