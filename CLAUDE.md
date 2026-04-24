# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A static HTML documentation/workshop site for a UX design team at Medpace — a clinical trial / life sciences software company. The site covers an initiative introducing three AI tools (Claude Design, Figma Make, Cursor + Claude Code) into the team's design practice. No build step, no framework, no package manager.

To run locally:
```bash
./serve
# Visit http://localhost:8000
```

For a plain static server without live reload:
```bash
python -m http.server
```

## Architecture

```
index.html          — Homepage / tool comparison landing page
nav.js              — Self-contained navigation component (IIFE; injects its own CSS)
styles/shared.css   — Design system: CSS custom properties only (colors, typography)
pages/*.html        — Content pages (self-contained; each includes all its own CSS)
Images/             — PNG screenshots referenced by index.html tool cards
initiative-context.md — Domain and project context (read this before writing content)
```

**Every page** follows this structure: `<link>` to shared.css → `<style>` block for page-specific CSS → `<script src="nav.js">` as first element of `<body>` → page-header div → section divs → page-footer div → optional inline `<script>`.

**nav.js** detects whether the page is in `/pages/` and adjusts root-relative links accordingly. It loads the page list by first trying a local directory listing, then falling back to the GitHub API at `github.com/lustandfury/medpace_UX_analysis`.

**shared.css** provides only: Google Fonts imports (Fraunces, Roboto, Roboto Mono), CSS custom properties (`--navy`, `--teal`, `--mint`, `--amber`, `--slate`, `--violet`, `--blueD`, and light tint variants), a box-sizing reset, and body defaults. No layout utilities — all grid/flex layout is defined inline per page.

## CSS Conventions

- All colors reference CSS variables from shared.css — never hardcode hex values that duplicate an existing variable.
- Responsive breakpoints: `900px` (two-column collapse) and `768px` (single-column / mobile padding).
- Page-specific class names are scoped by page — no shared component classes except what's in shared.css.
- Dark sections use `var(--navy)` background; text colors flip to `var(--white)` / `var(--slatel)` / `var(--mint-on-dark)`.

## Domain Context

The target audience is enterprise UX designers and frontend developers building **clinical trial monitoring software**. Content tone is practitioner-to-practitioner — not marketing copy. Key constraints of the team's actual product:

- Component library: **forked Angular Material UI** (not Tailwind, not React)
- Compliance: **21 CFR Part 11**, WCAG 2.1 AA
- Color-blind-safe patterns required (icon + label, never color alone for status)
- Reference products for design language: Salesforce, Jira — high data density, not consumer aesthetic

When generating prompt examples or tutorial content, use the canonical reference feature: **Patient Enrollment Table for trial ONCO-2024-003** (see `initiative-context.md` §11 for full data).

The three tools covered have distinct roles: Claude Design owns exploration/stakeholder prototypes, Figma Make owns screens that need to live on the Figma canvas, Cursor + Claude Code owns prototypes that terminate in Angular Material output Kelly can work with directly.

Do not present Storybook as a settled part of the team's workflow — it is under review due to Angular support limitations (see `initiative-context.md` §10).
