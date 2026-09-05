"use client";

import {
  ComponentShowcase,
  Card,
  Col,
  Row,
  ThemeProvider,
  Button,
  Link,
  Tooltip,
  Dropdown,
  Accordion,
  Popup,
  DatePicker,
  TimePicker,
  Navbar,
  Footer,
  TextEditor,
  MediaLibrary,
  MarkdownRenderer,
  Usage,
} from "@mono/components";
import { useTheme } from "next-themes";
import "./components-demo.css";

const packageOptions = ["mono/components", "mono/auth", "mono/database", "mono/rose"];
const boolOptions = [
  { label: "true", value: "true" },
  { label: "false", value: "false" },
];

function ThemeToggleDemo() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <div className="components-demo-theme">
      <p>
        Resolved theme: <strong>{resolvedTheme}</strong>
      </p>
      <button type="button" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
        Toggle theme
      </button>
    </div>
  );
}

const alignOptions = ["flex-start", "center", "flex-end"];
const justifyOptions = ["flex-start", "center", "space-between"];

const dropdownItems = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

const accordionItems = [
  { title: "What is Machi Asia?", content: "Machi Asia is a platform for building and deploying AI-powered products." },
  { title: "How do I get started?", content: "Sign in as a guest or create an account, then explore the documentation." },
  { title: "Is it free?", content: "The core platform is free to use. Premium features may require a subscription." },
];

const mediaItems = [
  { id: "1", url: "https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/hero-banner.png", name: "hero-banner.png", type: "image" as const, size: 245000, createdAt: "2026-09-02T10:00:00Z" },
  { id: "2", url: "https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/project-spec.pdf", name: "project-spec.pdf", type: "pdf" as const, size: 1420000, createdAt: "2026-09-03T08:30:00Z" },
  { id: "3", url: "https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/contract-v2.docx", name: "contract-v2.docx", type: "docx" as const, size: 84000, createdAt: "2026-09-03T09:15:00Z" },
  { id: "4", url: "https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/brand-assets.png", name: "brand-assets.png", type: "image" as const, size: 520000, createdAt: "2026-09-03T11:45:00Z" },
  { id: "5", url: "https://zyatzdkapdqngwyhiqqn.supabase.co/storage/v1/object/public/media/users/guest/annual-report.pdf", name: "annual-report.pdf", type: "pdf" as const, size: 3120000, createdAt: "2026-09-03T12:00:00Z" },
];

const sampleObsidianDocs: Record<string, string> = {
  full: `# Obsidian Knowledge Note

This is an authentic Obsidian-flavored markdown document. Check out the [[Design System]] or visit [[Architecture|System Architecture]] for more.

Categorized under #knowledge/obsidian and #frontend/components.

> [!tip] Quick Pro Tip
> Obsidian callouts support custom titles and automatic icon selection based on callout types!

> [!warning]- Foldable Callout (Click to Expand)
> This warning is collapsed by default using the \`> [!warning]-\` syntax.
> It can contain nested details, code blocks, or links!

### Project Goals
- [x] Integrate Obsidian callouts with Lucide icons
- [x] Support [[Wikilinks]] and #tags
- [x] Add ==highlighted text== and ~~strikethrough~~
- [ ] Connect bi-directional graph view

Here is a code sample with language badge and one-click copy:
\`\`\`typescript
interface Note {
  title: string;
  tags: string[];
}
\`\`\`

| Feature | Supported | Notes |
| --- | --- | --- |
| Callouts | Yes | Note, Tip, Warning, Danger, Info |
| Wikilinks | Yes | Both [[Link]] and [[Link\\|Alias]] |
| Task List | Yes | Interactive checkboxes |
`,
  callouts: `# Callouts Gallery

> [!note] Standard Note
> Useful background information and notes.

> [!tip] Helpful Tip
> Pro-tips and best practices for writing clean markdown.

> [!info] Information
> General announcements and informational messages.

> [!warning] Caution Required
> Warning regarding non-backward compatible modifications.

> [!danger] Destructive Action
> Irreversible changes or data loss hazards.

> [!example] Code Example
> Walkthrough of a practical code snippet.

> [!todo] Action Item
> Tasks that require immediate follow-up.

> [!success] Verified Done
> All automated tests and quality checks passed!
`,
  tasks: `# Task List & Tags

Track items with interactive checkboxes and tag taxonomy.

- [x] Set up Next.js monorepo architecture
- [x] Add Supabase authentication with guest access
- [x] Build shared component library
- [ ] Implement Obsidian markdown renderer
- [ ] Launch production app

Tagged under: #roadmap/2026 #sprint/active #release/ready
`,
  wikilinks: `# Obsidian Interlinking

Connect notes seamlessly using Obsidian's double bracket syntax:

- Read the overview at [[Project Overview]]
- Deep dive into [[Architecture|Monorepo Architecture Documentation]]
- Component showcase: [[Components/Showcase|Component Library Showcase]]

Also highlights ==crucial terms== and ~~outdated procedures~~!
`,
};

export function ComponentsShowcase() {
  return (
    <ComponentShowcase
      packageName="mono/components"
      description="Shared UI component library: the design-token theme system, layout primitives, and functional elements that every page must build on."
      components={[
        {
          name: "ComponentShowcase",
          uses: 'import { ComponentShowcase } from "@mono/components"',
          description: "The reusable list-view layout that every package showcase page uses.",
          propControls: [
            {
              prop: "packageName",
              label: "packageName prop",
              options: packageOptions,
              defaultValue: "mono/components",
            },
          ],
          render: ({ packageName }) => (
            <ComponentShowcase
              packageName={packageName}
              description="Living proof this item renders the real ComponentShowcase with the chosen packageName."
              components={[
                {
                  name: "Demo component",
                  description: "A nested showcase demonstrating the packageName dropdown above.",
                  render: () => <p>Rendered as part of @{packageName}.</p>,
                },
              ]}
            />
          ),
        },
        {
          name: "ThemeProvider",
          uses: 'import { ThemeProvider } from "@mono/components"',
          description: "Wraps next-themes to enable theme switching with dark mode as default and gold accents.",
          propControls: [
            {
              prop: "defaultTheme",
              label: "defaultTheme prop",
              options: ["dark", "light", "system"],
              defaultValue: "dark",
            },
          ],
          render: ({ defaultTheme }) => (
            <ThemeProvider defaultTheme={defaultTheme as "dark" | "light" | "system"}>
              <ThemeToggleDemo />
            </ThemeProvider>
          ),
        },
        {
          name: "Row",
          uses: 'import { Row, Col } from "@mono/components"',
          description: "Flex row layout primitive. Controls horizontal arrangement, wrap, alignment, and gutter.",
          propControls: [
            { prop: "align", label: "align", options: alignOptions, defaultValue: "center" },
            { prop: "justify", label: "justify", options: justifyOptions, defaultValue: "space-between" },
            { prop: "wrap", label: "wrap", options: boolOptions, defaultValue: "true" },
          ],
          render: ({ align, justify, wrap }) => (
            <Row align={align as never} justify={justify as never} wrap={wrap === "true"}>
              <Card padded={false} className="components-demo-box" as="div">A</Card>
              <Card padded={false} className="components-demo-box" as="div">B</Card>
              <Card padded={false} className="components-demo-box" as="div">C</Card>
            </Row>
          ),
        },
        {
          name: "Col",
          uses: 'import { Col } from "@mono/components"',
          description: "Grid column primitive. Takes a span (1-12) and optional offset for 12-column layouts.",
          propControls: [
            { prop: "span", label: "span", options: ["4", "6", "8", "12"], defaultValue: "6" },
          ],
          render: ({ span }) => (
            <Row>
              <Col span={Number(span)}>
                <Card className="components-demo-box" as="div">span {span}</Card>
              </Col>
              <Col span={12 - Number(span)}>
                <Card className="components-demo-box" as="div">span {12 - Number(span)}</Card>
              </Col>
            </Row>
          ),
        },
        {
          name: "Card",
          uses: 'import { Card } from "@mono/components"',
          description: "Surface container with token-styled border, padding, and elevation variants.",
          propControls: [
            { prop: "elevated", label: "elevated", options: boolOptions, defaultValue: "false" },
            { prop: "bordered", label: "bordered", options: boolOptions, defaultValue: "true" },
            { prop: "padded", label: "padded", options: boolOptions, defaultValue: "true" },
          ],
          render: ({ elevated, bordered, padded }) => (
            <div className="components-demo-card-wrap">
              <Card
                elevated={elevated === "true"}
                bordered={bordered === "true"}
                padded={padded === "true"}
              >
                A token-styled card surface.
              </Card>
            </div>
          ),
        },
        {
          name: "Button",
          uses: 'import { Button } from "@mono/components"',
          description: "Action button with variant, size, and loading state support.",
          propControls: [
            { prop: "variant", label: "variant", options: ["primary", "secondary", "ghost", "danger"], defaultValue: "primary" },
            { prop: "size", label: "size", options: ["sm", "md", "lg"], defaultValue: "md" },
            { prop: "disabled", label: "disabled", options: boolOptions, defaultValue: "false" },
          ],
          render: ({ variant, size, disabled }) => (
            <Button variant={variant as never} size={size as never} disabled={disabled === "true"}>
              Click me
            </Button>
          ),
        },
        {
          name: "Link",
          uses: 'import { Link } from "@mono/components"',
          description: "Styled anchor with variant and external link support.",
          propControls: [
            { prop: "variant", label: "variant", options: ["default", "underline", "ghost"], defaultValue: "default" },
            { prop: "external", label: "external", options: boolOptions, defaultValue: "false" },
          ],
          render: ({ variant, external }) => (
            <Link href="#" variant={variant as never} external={external === "true"}>
              Navigate somewhere
            </Link>
          ),
        },
        {
          name: "Tooltip",
          uses: 'import { Tooltip } from "@mono/components"',
          description: "Hover/focus tooltip that appears near the trigger element or circular help button.",
          propControls: [
            { prop: "variant", label: "variant", options: ["default", "help"], defaultValue: "default" },
            { prop: "position", label: "position", options: ["top", "bottom", "left", "right"], defaultValue: "top" },
          ],
          render: ({ variant, position }) =>
            variant === "help" ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Usage Tier: Authenticated</span>
                <Tooltip
                  variant="help"
                  content="Tier limits: 20 msgs/day, 200/week"
                  position={position as never}
                  triggerAriaLabel="View tier details"
                />
              </div>
            ) : (
              <Tooltip content="Helpful hint" position={position as never}>
                <Button variant="secondary" size="sm">Hover me</Button>
              </Tooltip>
            ),
        },
        {
          name: "Dropdown",
          uses: 'import { Dropdown } from "@mono/components"',
          description: "Custom select dropdown with keyboard support and disabled items.",
          propControls: [
            { prop: "disabled", label: "disabled", options: boolOptions, defaultValue: "false" },
          ],
          render: ({ disabled }) => (
            <Dropdown
              items={dropdownItems}
              placeholder="Pick a fruit..."
              disabled={disabled === "true"}
            />
          ),
        },
        {
          name: "Accordion",
          uses: 'import { Accordion } from "@mono/components"',
          description: "Collapsible content sections supporting single or multiple open panels.",
          propControls: [
            { prop: "multiple", label: "multiple", options: boolOptions, defaultValue: "false" },
          ],
          render: ({ multiple }) => (
            <Accordion items={accordionItems} multiple={multiple === "true"} defaultOpen={[0]} />
          ),
        },
        {
          name: "Popup",
          uses: 'import { Popup } from "@mono/components"',
          description: "Floating content panel that appears when clicking a trigger element.",
          propControls: [
            { prop: "position", label: "position", options: ["top", "bottom", "left", "right"], defaultValue: "bottom" },
          ],
          render: ({ position }) => (
            <Popup
              trigger={<Button variant="secondary" size="sm">Open popup</Button>}
              position={position as never}
            >
              <div style={{ padding: "0.5rem" }}>
                <strong>Popup content</strong>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem" }}>Click outside to close.</p>
              </div>
            </Popup>
          ),
        },
        {
          name: "DatePicker",
          uses: 'import { DatePicker } from "@mono/components"',
          description: "Calendar date picker with month navigation and min/max range support.",
          render: () => <DatePicker value="2026-09-03" onChange={() => {}} />,
        },
        {
          name: "TimePicker",
          uses: 'import { TimePicker } from "@mono/components"',
          description: "Increment/decrement time picker with 12h/24h mode support.",
          propControls: [
            { prop: "use24Hour", label: "use24Hour", options: boolOptions, defaultValue: "false" },
          ],
          render: ({ use24Hour }) => (
            <TimePicker value="14:30" use24Hour={use24Hour === "true"} />
          ),
        },
        {
          name: "Navbar",
          uses: 'import { Navbar } from "@mono/components"',
          description: "Top navigation bar with brand, links, action slots, and an optional auth menu showing avatar, name, and sign-out.",
          propControls: [
            { prop: "variant", label: "variant", options: ["default", "tabs", "compact"], defaultValue: "default" },
            { prop: "showAuth", label: "auth", options: boolOptions, defaultValue: "true" },
          ],
          render: ({ variant, showAuth }) => (
            <Navbar
              variant={variant as "default" | "tabs" | "compact"}
              brand={<span>Machi Asia</span>}
              links={[
                { label: "Home", href: "/", active: true },
                { label: "Docs", href: "/docs" },
                { label: "Blog", href: "/blog" },
              ]}
              actions={<Button variant="primary" size="sm">Sign in</Button>}
              auth={
                showAuth === "true"
                  ? { name: "Jane Doe", onSignOut: () => {} }
                  : undefined
              }
            />
          ),
        },
        {
          name: "Footer",
          uses: 'import { Footer } from "@mono/components"',
          description: "Site footer with links and copyright.",
          render: () => (
            <Footer
              links={[
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Contact", href: "/contact" },
              ]}
              copyright="2026 Machi Asia. All rights reserved."
            />
          ),
        },
        {
          name: "TextEditor",
          uses: 'import { TextEditor } from "@mono/components"',
          description: "Basic rich text editor with bold, italic, underline, and list formatting.",
          render: () => <TextEditor placeholder="Write something..." />,
        },
        {
          name: "MediaLibrary",
          uses: 'import { MediaLibrary } from "@mono/components"',
          description: "Database-connected media browser with user-scoped private library, image/pdf/docx filtering, pagination, inspection modal with quick-copy public link, and delete capabilities.",
          propControls: [
            {
              prop: "initialFilter",
              label: "filter",
              options: ["all", "image", "pdf", "docx"],
              defaultValue: "all",
            },
            {
              prop: "pageSize",
              label: "pageSize",
              options: ["2", "4", "6", "12"],
              defaultValue: "4",
            },
          ],
          render: ({ initialFilter, pageSize }) => (
            <MediaLibrary
              items={mediaItems}
              initialFilter={initialFilter as never}
              pageSize={Number(pageSize) || 4}
              onSelect={() => {}}
            />
          ),
        },
        {
          name: "MarkdownRenderer",
          uses: 'import { MarkdownRenderer } from "@mono/components"',
          description: "Obsidian-flavored Markdown renderer supporting callouts/admonitions with icons, wikilinks, tags, task lists, code blocks with copy, highlights, tables, and footnotes.",
          propControls: [
            {
              prop: "preset",
              label: "sample note",
              options: ["full", "callouts", "tasks", "wikilinks"],
              defaultValue: "full",
            },
          ],
          render: ({ preset }) => (
            <div style={{ padding: "1rem", background: "var(--color-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
              <MarkdownRenderer
                content={sampleObsidianDocs[preset || "full"] || sampleObsidianDocs.full}
                onWikilinkClick={(target, alias) => alert(`Wikilink clicked: ${target} (${alias})`)}
                onTagClick={(tag) => alert(`Tag clicked: #${tag}`)}
                onTaskToggle={(text, checked) => alert(`Task toggled: "${text}" => ${checked ? "checked" : "unchecked"}`)}
              />
            </div>
          ),
        },
        {
          name: "Usage",
          uses: 'import { Usage } from "@mono/components"',
          description: "Resource usage tracker with color-coded status thresholds (normal, warning, danger, exceeded), formatted numbers, and progress bar.",
          propControls: [
            {
              prop: "level",
              label: "usage level",
              options: ["normal (45%)", "warning (80%)", "danger (95%)", "exceeded (115%)"],
              defaultValue: "normal (45%)",
            },
            {
              prop: "size",
              label: "size",
              options: ["sm", "md", "lg"],
              defaultValue: "md",
            },
          ],
          render: ({ level, size }) => {
            const usedMap: Record<string, number> = {
              "normal (45%)": 45,
              "warning (80%)": 80,
              "danger (95%)": 95,
              "exceeded (115%)": 115,
            };
            const usedVal = usedMap[level || "normal (45%)"] ?? 45;
            return (
              <div style={{ maxWidth: 460, width: "100%" }}>
                <Usage
                  label="Monthly Bandwidth"
                  used={usedVal}
                  total={100}
                  unit="GB"
                  size={(size as "sm" | "md" | "lg") || "md"}
                  description="Resets at the start of next billing period."
                />
              </div>
            );
          },
        },
      ]}
    />
  );
}
