# ADR-007: Obsidian-Flavored Markdown Renderer

## Status

Accepted

## Date

2026-09-03

## Context

Machi Asia applications, notably `apps/docs`, `apps/rose`, and internal knowledge bases, need to display documentation, AI responses, notes, and instructions with rich formatting. Standard markdown parsers only support basic headings and lists. Obsidian's flavor of markdown has become the industry standard for personal knowledge management, note-taking, and technical documentation due to its callout blocks (`> [!note]`), wikilinks (`[[Note]]`), taxonomy tags (`#tag`), task lists (`- [ ]`), highlights (`==mark==`), and clean dark aesthetic.

## Decision

Introduce `MarkdownRenderer` in `@mono/components`:

1. **Obsidian Callouts / Admonitions**: Full support for standard and foldable callouts (`> [!note]`, `> [!tip]`, `> [!warning]`, `> [!danger]`, `> [!example]`, `> [!todo]`, `> [!success]`, `> [!abstract]`, `> [!question]`, etc.) with foldable state toggles (`+` / `-`), custom titles, and colored left border accents with matching Lucide icons.
2. **Obsidian Wikilinks**: Support `[[Target]]` and `[[Target|Alias]]` with `onWikilinkClick` callback.
3. **Obsidian Tags**: Support `#tag` and `#tag/subtag` pills with `onTagClick` callback.
4. **Interactive Tasks**: Task checkboxes `- [ ]` and `- [x]` with `onTaskToggle` event propagation.
5. **Highlights & Del**: `==highlighted==` rendered as `<mark>` and `~~deleted~~` as `<del>`.
6. **Code Blocks**: Fenced code blocks with language badge and one-click copy button.
7. **Tables & Footnotes**: GFM tables and `[^1]` footnote definitions with back-references.

## Consequences

- Any app in the monorepo can render Obsidian-compatible markdown notes consistently.
- Follows the monorepo design system (dark mode primary, gold accents, CSS token custom properties).
- Live interactive showcase available in `apps/docs/src/app/components/components`.
