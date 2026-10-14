export const MARKDOWN_SHOWCASE_CONTENT = `# Markdown Design System Showcase

Welcome to the **unified MarkdownRenderer** demonstration. This component renders all standard and extended Markdown features matching the website's dark slate luxury aesthetic and theme tokens.

---

## 1. Typography & Inline Formatting

Paragraph text can include **bold emphasis**, *italic styling*, ***bold and italic***, ~~strikethrough text~~, and \`inlineCodeObject.method()\`.

- **Entity Badge References**: Mention entities dynamically using @project:"SAMS+", @skill:"TypeScript", @certificate:"AWS Certified", and @experience:"Staff Engineer".
- **Easter Egg**: The word lasagna shines with a heavenly golden glow.
- **Hyperlinks**: Visit the [Knowledge Wiki](/sites/wiki) or check out [GitHub](https://github.com).

---

## 2. GitHub-Style Callout Boxes

> [!NOTE]
> **Information Notice**: All theme tokens adapt dynamically to custom palettes (Gold, Indigo, Emerald, Rose).

> [!TIP]
> **Performance Tip**: Code blocks include automatic syntax copying and reactive copy feedback.

> [!IMPORTANT]
> **Critical Architecture Rule**: Every shared component must support the \`variant\` prop and avoid hardcoded color values.

> [!WARNING]
> **Resource Alert**: High network latency detected across multi-region serverless endpoints.

> [!CAUTION]
> **Security Warning**: Database migrations must be tested in staging before applying to production clusters.

> [!CODE]
> **Snippet Callout**: \`npx tsx --env-file=.env.local scripts/sync-data.ts\`

---

## 3. Fenced Code Blocks

\`\`\`typescript
interface PipelineExecution {
  id: string;
  workflow: "CI" | "CD" | "Observability";
  status: "success" | "running" | "failed";
  durationSeconds: number;
}

export function executePipeline(config: PipelineExecution): Promise<boolean> {
  console.log(\`Running \${config.workflow} pipeline (\${config.id})...\`);
  return Promise.resolve(config.status === "success");
}
\`\`\`

\`\`\`bash
# Run the full testing and static verification pipeline
npm test
\`\`\`

---

## 4. Standard Blockquotes

> "Simplicity is prerequisite for reliability."
> — Edsger W. Dijkstra

---

## 5. Unordered, Ordered, and Task Lists

### Feature Checklist
- [x] Design token CSS custom properties integration
- [x] Responsive GFM Table container with horizontal scroll
- [x] Fenced code blocks with language headers and one-click copy
- [ ] Automated end-to-end visual regression testing

### Numbered Workflow Steps
1. Initial repository structure and schema definition
   1. Define Postgres tables and RLS security policies
   2. Configure Supabase client wrappers and TypeScript types
2. Develop global UI components in \`app/components/\`
3. Verify all Vitest unit tests and production build

---

## 6. GFM Tables

| Component | Variant | Responsive | Status |
| :--- | :--- | :---: | :--- |
| **MarkdownRenderer** | \`main\`, \`chatbot\`, \`wiki\` | Yes | ✅ Production |
| **WorkflowPipeline** | \`main\`, \`compact\` | Yes | ✅ Production |
| **GrafanaDashboard** | \`main\`, \`embedded\` | Yes | ✅ Production |
| **ImageModal** | \`wiki\`, \`main\` | Yes | ✅ Production |

---

## 7. Media & Lightbox Image Preview

Click on the diagram image below to preview the interactive zoom lightbox popup:

![Architecture Visual Framework](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200)

---

### Headings Reference (H1 through H6)
# H1 Top Heading
## H2 Major Section
### H3 Subsection Topic
#### H4 Component Level
##### H5 Detail Category
###### H6 Micro Label
`;
