import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-moss-deep text-[#f6f1e8]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-6">
        <div>
          <Logo light />
          <p className="mt-4 max-w-md text-sm leading-6 text-[#d9e2da]">
            Evidra is an educational desk for dietary supplement decisions. It grades ingredients, reads doses, and writes a goal note. It does not diagnose, treat, or replace your clinician.
          </p>
        </div>
        <div>
          <p className="eyebrow text-[#e7c7a4]">Move</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/search">Search the library</Link></li>
            <li><Link href="/scan">Scan a barcode</Link></li>
            <li><Link href="/consultant">Health-goals guide</Link></li>
            <li><Link href="/compare">Compare ingredients</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-[#e7c7a4]">Method</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/method">How grades are assigned</Link></li>
            <li><Link href="/ingredients">Ingredient monographs</Link></li>
            <li><a href="https://dsld.od.nih.gov/" target="_blank" rel="noreferrer">NIH DSLD</a></li>
            <li><a href="https://ods.od.nih.gov/factsheets/list-all/" target="_blank" rel="noreferrer">NIH ODS fact sheets</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs leading-5 text-[#b7c4bb] md:px-6">
          Photography via Pexels. Label lookups use the public NIH Dietary Supplement Label Database and, for foods, Open Food Facts. Curated products in the demo shelf use fictional brands so the teaching labels stay stable.
        </p>
      </div>
    </footer>
  );
}
