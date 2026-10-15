"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";

const links = [
  { href: "/search", label: "Search" },
  { href: "/scan", label: "Scan" },
  { href: "/ingredients", label: "Library" },
  { href: "/consultant", label: "Guide" },
  { href: "/shelf", label: "Shelf" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-[#f3efe6]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" aria-label="Evidra home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-active={pathname === link.href || pathname.startsWith(`${link.href}/`)}
              className="nav-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/scan" className="btn btn-primary px-4 py-2 text-sm md:hidden">
          Scan
        </Link>
      </div>
    </header>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[#fbf7f1]/95 backdrop-blur md:hidden">
      <ul className="grid grid-cols-5">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-1 py-3 text-center text-[11px] font-semibold tracking-wide ${active ? "text-moss" : "text-muted"}`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
