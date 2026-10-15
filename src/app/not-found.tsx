import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 md:px-6">
      <p className="eyebrow text-copper">404</p>
      <h1 className="mt-2 text-5xl">That page is not in the library.</h1>
      <Link href="/" className="btn btn-primary mt-6">Back to the desk</Link>
    </main>
  );
}
