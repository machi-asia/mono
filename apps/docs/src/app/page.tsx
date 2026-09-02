import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Machi Asia Docs</h1>
      <p>Component library and user documentation.</p>
      <h2>Package Component Showcases</h2>
      <ul>
        <li>
          <Link href="/components/auth">@mono/auth</Link> — authentication components
        </li>
        <li>
          <Link href="/components/components">@mono/components</Link> — shared UI components
        </li>
        <li>
          <Link href="/components/database">@mono/database</Link> — data/store exports
        </li>
      </ul>
    </main>
  );
}
