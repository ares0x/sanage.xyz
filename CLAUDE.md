# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

sanage.xyz is a personal portfolio site featuring interactive personality quizzes. It is built as a static Astro site deployed to Cloudflare Pages, with API endpoints implemented as Cloudflare Pages Functions backed by Cloudflare KV.

## Development Commands

```bash
# Install dependencies
pnpm install

# Build data bundles (required before dev/build when quiz data changes)
npm run prebuild

# Start Astro dev server
npm run dev

# Production build
npm run build

# Preview built site
npm run preview

# Deploy to Cloudflare Pages
npm run deploy

# Regenerate Wrangler types after KV config changes
npm run cf-typegen
```

## Architecture

### Frontend

- **Astro** (`src/pages/`) renders static HTML. All pages use `output: 'static'`.
- **Alpine.js** (loaded via CDN in pages) drives all frontend interactivity. Quiz UIs are implemented as inline Alpine.js apps within `.astro` pages, not as separate JS frameworks.
- **Tailwind CSS v4** is configured via Vite plugin in `astro.config.mjs`.
- **Content Collections** (`src/content/works/`) define work metadata using `src/content.config.ts`.

### Quiz Data Pipeline

Quiz data lives in `src/data/` and must be built into browser-consumable bundles before the site can run:

| Source | Output | Builder |
|--------|--------|---------|
| `src/data/qianfu/quiz.ts` | `public/js/qianfu-data.js` | esbuild IIFE via `scripts/build-data.js` |
| `src/data/wulin/quiz.json` | `public/js/wulin-data.js` | `JSON.stringify` wrapper |
| `src/data/qianfu/exam.json` | `public/js/qianfu-exam-data.js` | `JSON.stringify` wrapper |

`scripts/build-data.js` also generates `functions/lib/qianfu-exam-answers.ts` from `exam.json` so the server-side exam grader has access to correct answers without reading JSON at runtime.

**Always run `npm run prebuild` after modifying any file in `src/data/` before testing.**

### Quiz Engines

Quiz scoring logic is implemented as standalone IIFE scripts in `public/js/`, not bundled by Astro/Vite:

- `public/js/qianfu-engine.js` — Qianfu v2 engine (cosine similarity + Euclidean distance + purpose affinity + classification weights)
- `public/js/wulin-engine.js` — Wulin engine (similar hybrid approach)
- `public/js/quiz-engine.js` — Original v1 engine (legacy)

Engines expose globals (e.g. `window.createEngineV2`) consumed by inline Alpine.js code in Astro pages. The qianfu page loads both the engine and the data bundle; the wulin page loads its engine plus an inline `define:vars` script for config.

### Backend (Cloudflare Pages Functions)

API routes in `functions/api/` run on Cloudflare Pages Functions:

- `functions/api/_middleware.ts` — Global CORS and error handling
- `functions/api/{qianfu,wulin,skin-tone}/submit.ts` — Quiz submission handlers
- `functions/api/{qianfu,wulin,skin-tone}/stats.ts` — Stats retrieval
- `functions/api/qianfu/exam/submit.ts` — Exam grading (uses pre-generated answers)
- `functions/api/qianfu/exam/stats.ts` — Exam stats

Shared utilities:
- `functions/utils/quiz-handler.ts` — Generic submit handler with rate limiting
- `functions/utils/kv.ts` — KV read/write helpers for quiz and exam stats

Rate limiting is IP-based via KV keys (`rate:{product}:{ip}:{date}`), capped at 10 submits/day. It is automatically skipped in local development when `CF-Connecting-IP` is absent.

### KV Namespace

`ROLE_STATS` is the single KV namespace bound in `wrangler.jsonc`. Keys follow these patterns:

- `{product}:role:{roleName}` — per-role submission count
- `{product}:total` — total submissions
- `{product}:exam:total` — exam total submissions
- `{product}:exam:level:{level}` — exam level distribution
- `{product}:exam:sum_scores` — running sum of exam scores
- `rate:{product}:{ip}:{date}` — rate limit tracking

### Relationship Matching

Both personality quizzes support "share link → friend takes quiz → auto relationship analysis":

- Archive code format: `[primaryRoleIdx][secondaryRoleIdx][checksum]` where checksum = (primary + secondary) mod 10
- Share URL includes `?match=ABC`
- Result page detects the parameter and auto-triggers relationship display

### TypeScript Configuration

`tsconfig.json` uses `"moduleResolution": "Bundler"` and includes `worker-configuration.d.ts` for Cloudflare types. The `functions/` directory and `src/` directory share the same tsconfig.

## Adding a New Quiz Product

To add a new personality quiz, you typically need:

1. Data source in `src/data/{product}/`
2. Update `scripts/build-data.js` to build the new data bundle
3. Quiz engine script in `public/js/{product}-engine.js`
4. Astro page in `src/pages/works/{product}.astro` with inline Alpine.js app
5. API endpoints in `functions/api/{product}/submit.ts` and `stats.ts`
6. Content collection entry in `src/content/works/{product}.json`
7. Add the product to the shared `quiz-handler.ts` or create a custom handler if the scoring differs significantly
