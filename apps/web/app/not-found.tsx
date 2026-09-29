import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-3xl tracking-tight">That page is not here.</h1>
      <p className="mt-3 text-muted">The site is small on purpose.</p>
      <p className="mt-6">
        <Link href="/" className="text-accent underline underline-offset-4">
          Back to EditUI
        </Link>
      </p>
    </section>
  );
}
