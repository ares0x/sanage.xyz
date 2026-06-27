# Project: sanage.xyz

> 三阿哥的个人品牌主港与流量入口。本项目为一个基于 Astro 编译的静态站点 (SSG)，不承载任何实际业务逻辑，主要作为流量枢纽分发导向各个子站，并集成了个人独立博客内容。

## Overview

A personal brand hub and content center. Currently featuring:
- **Ecosystem Listing** (`/works/`) — Works catalog dynamically generated from JSON collections (`src/content/works/`), listing:
  - **Sanage AI Lab** (`https://lab.sanage.xyz/`) — AI workspace for workflows, mini products, analysis, and build-in-public logs (Featured)
  - **CalmFlow** (`https://calmflow.sanage.xyz/`) — Desktop task management & action triggering system
  - **Quiz 测评室** (`https://quiz.sanage.xyz/`) — Personality quizzes collection (including *潜伏*, *武林外传*, *肤色诊断室*), migrated out to a dedicated subdomain
  - **Bu 占卜室** (`https://bu.sanage.xyz/`) — Digital divination platform combining traditional Zhouyi, coins, and calculation methods
- **Blog** (`/blog/`) — Integrated personal blog, dynamically rendering articles from Markdown content collection (`src/content/blogs/`)
- **Now page** (`/now/`) — Status and "what I'm doing now" live snapshot
- **About me** (`/about/`) — Personal biography, philosophy (Solve Your Own Problem), and product matrix overview
- **404 page** (`/404.html`) — Custom 404 page with crawlers blocked (`noindex`)

## Tech Stack

- **Platform**: Cloudflare Pages (Pure Static hosting of the `dist/` directory)
- **Framework**: [Astro](https://astro.build/) v5 (SSG) + Tailwind CSS v4
- **SEO & Analytics**: Standard meta tags (`MetaTags.astro`), OpenGraph, Twitter Cards, Schema.org (JSON-LD), and Google Analytics 4 (GA4) integration

## Project Structure

```
├── src/                    # Source directory
│   ├── components/         # Shared UI components
│   │   ├── Navigation.astro # Desktop top navigation + mobile bottom navigation
│   │   ├── Footer.astro     # Site footer
│   │   └── seo/            # Meta, OG, Twitter, Schema (JSON-LD) components
│   ├── content/            # Astro Content Collections (defined in content.config.ts)
│   │   ├── works/          # Works metadata (JSON files: quiz, calmflow, bu, lab)
│   │   └── blogs/          # Blog articles (Markdown files)
│   ├── layouts/            # Page layouts
│   │   └── BaseLayout.astro # Master wrapper integrating SEO components & GTM/GA4 scripts
│   ├── styles/             # Stylesheets (global.css using Tailwind v4)
│   └── pages/              # Astro pages (routing)
│       ├── index.astro     # Homepage (Hero section + ecosystems listing + build-in-public list)
│       ├── about.astro     # About page (personal biography & product table)
│       ├── now.astro       # Now page (live snapshot list)
│       ├── 404.astro       # Custom 404 template (Robots noindex)
│       ├── works/
│       │   └── index.astro # Works index listing page (renders dynamic works collection)
│       └── blog/
│           ├── index.astro # Blog listing page (renders dynamic blogs collection)
│           └── [slug].astro # Blog details page (dynamic rendering from markdown)
├── public/                 # Static assets (images, favicons, logos)
│   ├── _redirects          # Cloudflare Pages 301 redirects config (redirects old quiz links to quiz.sanage.xyz)
│   └── robots.txt          # Crawler instructions referencing dynamic sitemap-index.xml
├── wrangler.jsonc          # Wrangler configuration for Cloudflare deployment
├── tsconfig.json           # TypeScript configuration
└── package.json            # Scripts & dependencies (Astro, Tailwind v4, Wrangler)
```

## Routing & Trailing Slash Strategy

- **Static Pages**: Handled by Astro router. All routes (e.g. `/blog/`, `/works/`, `/about/`, `/now/`) use slash-terminated URLs by default to ensure uniform structure.
- **External Redirects**: Configured in `public/_redirects` to handle old paths that are now served by `quiz.sanage.xyz` subdomain. This is critical for retaining backlinks and page rank.

## Content Management (Blogs & Works)

### Blogs (`src/content/blogs/`)
- Registered under `'content'` collection in `src/content.config.ts`.
- Every blog post must contain a valid Frontmatter schema:
  - `title`: String
  - `description`: String
  - `pubDatetime`: Date (coerced)
  - `tags`: Array of strings (optional)
- Clean slug filenames are required (all-lowercase, no special characters, hyphens as word separators).

### Works (`src/content/works/`)
- Registered under `'data'` collection in `src/content.config.ts`.
- Every work metadata JSON file must adhere to the validation schema:
  - `title`, `description`, `slug`, `emoji`, `theme`, `tags`, `ogImage`, `status`, `statusLabel`, `links`.
- Adding or modifying cards here automatically updates the homepage ecosystem and the works list page (`/works/`).

## Design System & Development Guidelines

All future development, page layouts, component design, and styling modifications MUST strictly adhere to the project's design system described in [DESIGN_SYSTEM.md](file:///Users/jace/workspace/Code/Node/Personal/jacejia/sanage-xyz/docs/DESIGN_SYSTEM.md):
- **Design Philosophy**: "Paper & Ink" (纸墨, editorial layout, minimal typography, stamp-like 4px shadows, flat card hovers, and high-contrast letter spacing).
- **Color Tokens**: Only use the defined theme CSS variables (`var(--paper)`, `var(--paper-deep)`, `var(--ink)`, `var(--ink-soft)`, `var(--ember)`, `var(--rule)`). No hardcoded Hex, RGB, or Tailwind color utilities (`bg-white`, `text-black`, etc.).
- **Typography**: Display serif titles (`var(--font-display)`), sans-serif body UI (`var(--font-sans)`), and monospace tags (`var(--font-mono)`). Every section must use the `eyebrow` + display heading combo.
- **Layout & Rhythm**: Main containers must use `.container-edit`. Use horizontal separators (`rule-top`) and borders instead of drop shadows.
- **Components & Corners**: All buttons and card corners must have straight edges (`border-radius: 0`).

## Deployment & Verification

- Pre-build and compilation checks must be performed by running:
  ```bash
  pnpm build
  ```
- Build output `dist/` is deployed to Cloudflare Pages:
  ```bash
  pnpm deploy
  ```

