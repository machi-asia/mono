import { Link } from "@mono/components";

export default function Home() {
  return (
    <main className="docs-home">
      <h1 className="docs-home-title">Machi Asia Docs</h1>
      <p className="docs-home-subtitle">
        Component library and user documentation for Machi Asia products.
      </p>
      <section className="docs-home-section">
        <h2 className="docs-home-heading">Package Component Showcases</h2>
        <ul className="docs-home-list">
          <li>
            <Link href="/components/auth" variant="underline">@mono/auth</Link>
            <span className="docs-home-desc">— authentication components</span>
          </li>
          <li>
            <Link href="/components/components" variant="underline">@mono/components</Link>
            <span className="docs-home-desc">— shared UI components</span>
          </li>
          <li>
            <Link href="/components/database" variant="underline">@mono/database</Link>
            <span className="docs-home-desc">— data/store exports</span>
          </li>
        </ul>
      </section>
    </main>
  );
}
