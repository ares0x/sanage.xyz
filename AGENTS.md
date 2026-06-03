# Cloudflare Workers

STOP. Your knowledge of Cloudflare Workers APIs and limits may be outdated. Always retrieve current documentation before any Workers, KV, R2, D1, Durable Objects, Queues, Vectorize, AI, or Agents SDK task.

## Docs

- https://developers.cloudflare.com/workers/
- MCP: `https://docs.mcp.cloudflare.com/mcp`

For all limits and quotas, retrieve from the product's `/platform/limits/` page. eg. `/workers/platform/limits`

## Commands

| Command | Purpose |
|---------|---------|
| `npx wrangler dev` | Local development |
| `npx wrangler deploy` | Deploy to Cloudflare |
| `npx wrangler types` | Generate TypeScript types |

Run `wrangler types` after changing bindings in wrangler.jsonc.

## Node.js Compatibility

https://developers.cloudflare.com/workers/runtime-apis/nodejs/

## Errors

- **Error 1102** (CPU/Memory exceeded): Retrieve limits from `/workers/platform/limits/`
- **All errors**: https://developers.cloudflare.com/workers/observability/errors/

## Product Docs

Retrieve API references and limits from:
`/kv/` · `/r2/` · `/d1/` · `/durable-objects/` · `/queues/` · `/vectorize/` · `/workers-ai/` · `/agents/`

## Best Practices (conditional)

If the application uses Durable Objects or Workflows, refer to the relevant best practices:

- Durable Objects: https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/
- Workflows: https://developers.cloudflare.com/workflows/build/rules-of-workflows/

---

# Project: sanage.xyz

> 三阿哥的个人作品聚合站点。已包含「深海人格档案 · 潜伏」、「同福客栈人格档案 · 武林外传」两套人格测试，「潜伏十级学者考试」，及「肤色诊断室」肤色测试。

## Overview

A personal brand site and interactive personality quiz collection themed after classic TV series. Currently featuring:
- **深海人格档案 · 潜伏** (`/works/qianfu/`) — 25 situational questions to discover which *《潜伏》* character you resemble
- **同福客栈人格档案 · 武林外传** (`/works/wulin/`) — 25 situational questions to discover which *《武林外传》* character you resemble
- **十级学者考试** (`/works/qianfu/exam/`) — 30 knowledge questions about *《潜伏》*
- **肤色诊断室** (`/works/skin-tone/`) — 4-question + 16-color swatch skin tone detection workflow for makeup recommendations

## Tech Stack

- **Platform**: Cloudflare Pages (Astro static build + Pages Functions)
- **Frontend**: [Astro](https://astro.build/) (SSG) + [Alpine.js](https://alpinejs.dev/) (CDN) + [Tailwind CSS](https://tailwindcss.com/) (CDN)
- **Backend**: Cloudflare Pages Functions (`functions/api/`) written in TypeScript
- **Storage**: Cloudflare KV (`ROLE_STATS`)
- **Testing**: Vitest + `@cloudflare/vitest-pool-workers`
- **Build Tool**: Wrangler v4, esbuild (for data bundling)

## Project Structure

```
├── functions/              # Cloudflare Pages Functions
│   ├── api/                # API routes
│   │   ├── _middleware.ts  # Global middleware (CORS, error handling)
│   │   ├── submit.ts       # Legacy POST /api/submit (proxies to qianfu)
│   │   ├── stats.ts        # Legacy GET /api/stats (proxies to qianfu)
│   │   ├── exam/           # Legacy exam APIs (proxies to qianfu/exam)
│   │   ├── qianfu/         # 潜伏 product APIs
│   │   │   ├── submit.ts
│   │   │   ├── stats.ts
│   │   │   └── exam/
│   │   ├── wulin/          # 武林外传 product APIs
│   │   │   ├── submit.ts
│   │   │   └── stats.ts
│   │   └── skin-tone/      # 肤色诊断室 APIs
│   │       ├── submit.ts
│   │       └── stats.ts
│   └── utils/
│       └── kv.ts           # Shared KV utilities
├── src/                    # Source data & Astro pages
│   ├── pages/              # Astro pages
│   │   ├── index.astro     # Homepage
│   │   ├── works/
│   │   │   ├── index.astro # Works listing page
│   │   │   ├── qianfu.astro
│   │   │   ├── wulin.astro
│   │   │   └── qianfu/exam/
│   │   └── ...
│   ├── data/               # Single source of truth for quiz data
│   │   ├── qianfu/
│   │   │   ├── quiz.ts     # 潜伏 personality quiz (roles, questions, rules, relationships)
│   │   │   └── exam.json   # 潜伏 exam questions & levels
│   │   └── wulin/
│   │       └── quiz.json   # 武林外传 quiz data
│   ├── content/            # Astro Content Collections
│   │   └── works/          # Works metadata for homepage/works page
│   ├── types/              # TypeScript type definitions (quiz-v2.ts)
│   ├── layouts/            # Astro layout components
│   └── scripts/            # Frontend utilities (intersection observer, etc.)
├── scripts/
│   └── build-data.js       # Unified data pipeline: TS/JSON → public/js bundles
├── public/                 # Static assets served by Pages
│   ├── works/              # Quiz pages (built by Astro)
│   ├── js/
│   │   ├── shared-components.js   # SEO, nav, footer, GA injection
│   │   ├── qianfu-data.js  # Auto-built from src/data/qianfu/quiz.ts
│   │   ├── qianfu-engine.js # Mixed matching engine + relationship analysis
│   │   ├── qianfu-exam/    # 潜伏 exam logic
│   │   ├── wulin-data.js   # Auto-built from src/data/wulin/quiz.json
│   │   └── wulin/          # 武林外传 quiz logic
│   ├── css/
│   ├── images/
│   ├── _redirects          # Cloudflare Pages redirects
│   ├── robots.txt
│   └── sitemap.xml
├── wrangler.jsonc          # Wrangler config (KV binding, assets, functions)
├── worker-configuration.d.ts  # Auto-generated Wrangler types
├── vitest.config.mts       # Vitest pool config
└── tsconfig.json
```

## API Endpoints

### 潜伏 (Qianfu)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/qianfu/submit` | Submit quiz result |
| `GET`  | `/api/qianfu/stats`  | Retrieve role stats |
| `POST` | `/api/qianfu/exam/submit` | Submit exam answers |
| `GET`  | `/api/qianfu/exam/stats`  | Retrieve exam stats |
| `GET`  | `/api/qianfu/exam/questions` | Retrieve exam questions |

### 武林外传 (Wulin)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/wulin/submit` | Submit quiz result |
| `GET`  | `/api/wulin/stats`  | Retrieve role stats |

### 肤色诊断室 (Skin Tone)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/skin-tone/submit` | Submit skin tone result |
| `GET`  | `/api/skin-tone/stats`  | Retrieve skin tone stats |

### Legacy (Backward Compatible)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/submit` | Proxies to `/api/qianfu/submit` |
| `GET`  | `/api/stats`  | Proxies to `/api/qianfu/stats` |
| `POST` | `/api/exam/submit` | Proxies to `/api/qianfu/exam/submit` |
| `GET`  | `/api/exam/stats`  | Proxies to `/api/qianfu/exam/stats` |
| `GET`  | `/api/exam/questions` | Proxies to `/api/qianfu/exam/questions` |

## KV Binding

- **Binding Name**: `ROLE_STATS`
- **Keys used**:
  - `{product}:total` — total submissions (product: `qianfu` | `wulin` | `skin-tone`)
  - `{product}:role:{roleName}` — per-role counter (10 roles for `qianfu`, 14 for `wulin`, 16 for `skin-tone`)
  - `{product}:exam:total` — total exam submissions
  - `{product}:exam:level:{n}` — per-level counter
  - `{product}:exam:sum_scores` — sum of all exam scores
  - `rate:{product}:{ip}:{date}` — daily rate-limit tracker (max 10/day)

## Quiz Logic

### 潜伏 (Qianfu) — V2 重制版

- **10 possible roles**: 余则成, 翠平, 吴敬中, 李涯, 谢若林, 陆桥山, 晚秋, 廖三民, 左蓝, 秋掌柜
- **25 questions** in 5 acts (入局→日常→危机→深渊→终局)
- **Dimensions tracked**: 执行力(execution), 高压承载(pressure), 判断力(judgment), 信仰(faith), 目的(purpose)
- **Matching engine**: cosine 45% + euclidean 30% + purpose affinity 15% + categorical 10%
- **Rarity flags**: 晚秋 (purpose=love && faith≤3 && pressure≤3 && judgment≤3), 廖三民 (pressure≥8 && faith≥8 && execution≤6), 秋掌柜 (pressure≥8 && faith≥8 && execution≤4)
- **双人关系分析**: 结果页自动解析 URL `?match=XXX` 进行双人关系匹配。档案编码格式 `[主角色索引][副角色索引][校验位]`（校验位 = 和 mod 10），3位十进制数，13条关系规则按优先级匹配，兜底「天津站同僚」。关系描述含 3 句话：定性 → 核心张力 → 命运判词

### 武林外传 (Wulin)

- **14 possible roles**: 佟湘玉, 白展堂, 郭芙蓉, 吕秀才, 李大嘴, 莫小贝, 祝无双, 邢育森, 燕小六, 钱掌柜, 赛貂蝉, 平谷一点红, 公孙乌龙, 郭巨侠
- **Dimensions tracked**: 侠义, 财商, 口才, 手艺, 武力, 幽默 (plus 道德, 情感, 风险, 权力, 商业 internally)
- **Exclusion rules**: High 侠义 (>20) excludes 公孙乌龙/赛貂蝉; high 幽默 (>25) excludes 郭巨侠/公孙乌龙
- **Fallback boosts**: 佟湘玉保底 (财商>15 && 侠义>10 && 武力<10 → +12); 白展堂保底 (侠义>14 && 幽默>10 && 武力>8 → +15); 吕秀才保底 (口才>16 && 武力<8 && 财商<10 → +12)
- **双人关系分析**: 与潜伏保持一致，档案编码格式 `[主角色(2位)][副角色(2位)][校验位]`（5位十进制数），13条关系规则，兜底「客栈路人」。支持 URL `?match=XXXXX` 自动匹配

### 肤色诊断室 (Skin Tone)

- **16 possible results**: 4 tones (cool, warm, neutral, olive) × 4 levels (1-4)
- **3-phase workflow**:
  1. **Phase 1 — 色调判断**: 4 questions (vein color, sun reaction, jewelry test, white paper test) vote for tone
  2. **Phase 2 — 明度校准**: 16-color swatch grid (4 tones × 4 depths), user picks closest match
  3. **Phase 3 — 结果校验**: If questionnaire tone conflicts with swatch tone, user manually chooses which to trust; otherwise auto-confirm
- **Result page**: Shows skin tone name, confidence score, traits, and makeup recommendations (foundation, blush, eyeshadow, lipstick)
- **No relationship matching**: This product does not use `?match=` or dual-person analysis
- **No URL state**: Clean URL throughout; result is not encoded in query params

## Sharing Strategy

**All products use the same unified sharing pattern:**

- **`share()` function**: `navigator.clipboard.writeText(window.location.href)` — silently copies URL to clipboard
- **No `navigator.share()` call** — does not open native system share sheet
- **No screenshot/archive card generation** — no DOM-to-image or canvas exports
- **No QR code** — removed from all products
- **No base64/hash encoding** in exam URLs — answer state is NOT stored in URL hash

The typical sharing flow for personality quizzes:
1. User finishes quiz → result page loads
2. `share()` copies the current URL (which may contain `?match=XXX` for relationship matching)
3. Friend opens the link → finishes their own quiz → `finish()` auto-detects `?match=` and calls `analyzeRelationship()` → displays relationship result

## URL State Strategy

- **潜伏 (Qianfu)**: `?role=` is used for initial result display (backward compatible). `?match=` is used for relationship matching.
- **武林外传 (Wulin)**: `?role=` is NOT auto-written to URL after quiz completion — result state is stored in Alpine.js reactive data only. `?match=` is used for relationship matching. A `showShareVisit()` function exists as minimal fallback for old `?role=` direct links.
- **Exam**: No URL state encoding. Clean URL throughout.
- **肤色诊断室**: No URL state encoding. Clean URL throughout.

## Redirects

- `/exam.html` → `/works/qianfu/exam/` (301)
- `/?role=:role` → `/works/qianfu/?role=:role` (301)
- `/#r=*` (hash-based answer restore) → `/works/qianfu/#r=*` (client-side)

## Data Pipeline

**Single source of truth** lives in `src/data/`. Browser bundles are auto-generated via `scripts/build-data.js` (run as `npm run prebuild`):

| Source | Format | Output | Method |
|--------|--------|--------|--------|
| `src/data/qianfu/quiz.ts` | TypeScript (contains functions: `rareCondition`, `verdictRules`, `relationshipArchetypes`, etc.) | `public/js/qianfu-data.js` | esbuild IIFE |
| `src/data/wulin/quiz.json` | JSON (static data only) | `public/js/wulin-data.js` | JSON.stringify wrapper |
| `src/data/qianfu/exam.json` | JSON (static data only) | `public/js/qianfu-exam-data.js` | JSON.stringify wrapper |

The build script also auto-generates `functions/api/qianfu/exam/answers-generated.ts` from `exam.json`, keeping the API answer key in sync with the source data.

## Build Commands

| Command | Purpose |
|---------|---------|
| `npm run prebuild` | Build data bundles (`scripts/build-data.js`) |
| `npm run build` | Astro static build (output to `dist/`) |
| `npm run dev` | Astro dev server |
| `npm test` | Run Vitest tests |
| `npm run cf-typegen` | Generate Wrangler TypeScript types |
| `npm run deploy` | Deploy to Cloudflare Pages |

## Known Issues / Notes

- `wrangler.jsonc` sets `"main": "src/index.ts"`, but this project uses **Pages Functions** (`functions/`) and **Astro static build** (`src/pages/`). The `main` field may be stale or incorrectly generated.
