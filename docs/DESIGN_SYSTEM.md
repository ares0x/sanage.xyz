# Sanage 设计系统 · Paper & Ink

> 三阿哥个人品牌主港的视觉与交互系统。
> 关键词：**纸墨 · 编辑式 · 印章红 · 慢节奏 · 长线生长**

---

## 1. 设计哲学

| 维度 | 主张 |
| --- | --- |
| 调性 | 文人独立开发者，沉稳但不严肃；像翻一本手感很好的杂志。 |
| 信息密度 | 高密度但不嘈杂——靠**字号反差**与**留白节奏**而不是色彩堆叠。 |
| 差异化 | 反主流"科技模板"——拒绝紫色渐变 / Inter / 三栏 Hero。 |
| 动效原则 | 极克制：链接位移、悬停色变、印章式 4px 偏移投影。 |

---

## 2. 颜色 · Color Tokens

全部以 `oklch()` 定义在 `src/styles.css` 中。**禁止**在组件里写硬编码颜色。

| Token | Light | 用途 |
| --- | --- | --- |
| `--paper` | `oklch(0.972 0.008 85)` ≈ `#f5f3ee` | 主纸张底，全站背景 |
| `--paper-deep` | `oklch(0.935 0.012 80)` ≈ `#e8e4dd` | 卡片底 / Marquee / Stats 带 |
| `--ink` | `oklch(0.18 0.005 80)` ≈ `#0d0d0d` | 主墨色，正文与标题 |
| `--ink-soft` | `oklch(0.30 0.005 80)` ≈ `#2d2d2d` | 次墨色，副文本 |
| `--ember` | `oklch(0.62 0.18 38)` ≈ 朱砂红 | **唯一强调色**，印章红，斜体高亮 / 悬停 / 时间轴节点 |
| `--rule` | `oklch(0.78 0.012 80)` | 分隔线 |

暗色模式自动反转 paper / ink；ember 不变。

**强调色用法纪律**：每屏 ember 出现次数 ≤ 3 处，否则失去印章意味。

---

## 3. 字体 · Typography

三层字体系统，全部通过 `<link>` 在 `__root.tsx` 引入。

| 角色 | Token | 字体 |
| --- | --- | --- |
| 展示 / 标题 | `--font-display` | **Instrument Serif** + Noto Serif SC（中文兜底） |
| 正文 / UI | `--font-sans` | **Work Sans** + PingFang/Noto Sans SC |
| 数据 / 标签 | `--font-mono` | **JetBrains Mono** |

### 字号阶梯

| 用途 | 类名 | 备注 |
| --- | --- | --- |
| Hero 巨标 | `text-[15vw] md:text-[9.5vw] lg:text-[8rem]` | 视口缩放，行高 `0.95` |
| 页面 H1 | `text-6xl md:text-8xl` | 永远配 eyebrow |
| 区块 H2 | `text-5xl md:text-6xl` | 可斜体强调一段 |
| 卡片 H3 | `text-3xl md:text-4xl` | display 字 |
| Eyebrow | `.eyebrow`（mono · 0.72rem · letter-spacing 0.18em · uppercase） | 所有区块入口必备 |
| 正文 | `text-base / text-lg` | 行高 1.6–1.75 |

### 排版纪律

- 每个区块/页面顶部必须有 **eyebrow + 大标题** 两件套。
- 标题中允许 **1 段**用 `italic text-[var(--ember)]` 高亮——再多就破。
- 中文标点遵循直角引号 `「」`，避免与 JS 字符串冲突。

---

## 4. 布局 · Layout

### 容器

```css
@utility container-edit {
  max-width: 1240px;
  padding-inline: 1.5rem; /* md: 2.5rem */
}
```

### 栅格

- 主栅格：**12 列**，`gap-4` ~ `gap-10`。
- 首页产品矩阵：**Bento 6 列网格** —— Featured 卡 `col-span-4 row-span-2`，其余 2~3 列。
- 文章/作品列表：12 列下的 `2 / 5 / 3 / 2` 编辑式分栏。

### 节奏

- 区块上下间距：`pt-24 pb-12`。
- 区块之间用 `rule-top`（1px 实线）而非阴影分隔。

---

## 5. 组件 · Components

### Buttons

| 变体 | 样式要点 | 用例 |
| --- | --- | --- |
| **Ink Press**（主） | 实心 ink 底 + paper 字，hover 时 `translate(-2,-2)` + `4px 4px 0 ember` 印章投影 | Hero 主 CTA |
| **Outline Ink** | ink 边框，hover 反转填充 | Hero 次 CTA |
| **Ghost Mono** | 仅 mono 文本，hover 变 ember | "查看完整 →" 等次级链接 |

所有按钮：`uppercase` + `tracking-wider` + `font-mono` + `text-sm` + 直角（`radius: 0`）。

### Chip / Eyebrow

- `.chip` —— 圆角胶囊，mono uppercase，常配 `h-1.5 w-1.5 rounded-full bg-ember` 圆点。
- `.eyebrow` —— 区块/字段的"小标题"，mono 微缩。

### Card

- 默认：`bg-card border border-rule p-6 md:p-8`。
- Hover：`border-ink`，**不**抬升/不阴影（保持纸面感）。
- 装饰：右下角放编号大字 `00`，`opacity-[0.04]`，hover 升至 `0.08`。

### Timeline

- `border-l border-rule` + `pl-8`。
- 节点：`h-4 w-4 rounded-full bg-paper border-2 border-ember` 内嵌小红点。

### Header / Footer

- Header：高 64px，sticky，背景 `paper` 82% + `backdrop-blur-md`，底边 1px rule。
- Footer：3 栏 colophon + 入口 + 阵地外链 + 底栏版权（mono）。

### Marquee

- 单行无限滚动 38s，`bg-paper-deep`，display 字 + ember `✦` 分隔。

---

## 6. 动效 · Motion

| 场景 | 行为 | 时长 |
| --- | --- | --- |
| 链接 hover | 颜色 → ember | 150ms |
| 箭头 → | `translate-x-1` | 150ms |
| Ink Press hover | 偏移 + 印章投影 | 150ms |
| Marquee | 线性无限平移 | 38s |
| 卡片 hover | 边框变 ink + 装饰编号渐显 | 200ms |

**禁止**：fade-in everything、parallax、视差英雄、滚动劫持。

---

## 7. 信息架构 · Site Map

| 路径 | 角色 | 关键元素 |
| --- | --- | --- |
| `/` | 首页/主港 | Hero · Marquee · Bento 产品矩阵 · Stats · Build Log · Blog Teaser |
| `/works` | 作品集 | 12 列编号列表 |
| `/now` | 公开构建日志 | 时间轴 |
| `/about` | 自我介绍 | 7/5 分栏 + Credo 卡 + 联络卡 |
| `/blog` | 写作集 | Featured 大标 + 列表 |

SEO：每个路由独立 `head()`，title <60 char、description <160 char、og:title/og:description。

---

## 8. 内容声音 · Tone of Voice

- 第一人称，自省、克制、有手感。
- 标题擅用「问句 / 反问 / 自我命题」（如"三阿哥又长高了吗"、"最近在做什么"）。
- 数字必须具体（"29,000+ 测试者"、"5 个在跑产品"）。
- 禁用空洞词：赋能 / 颠覆 / 革命 / 一站式 / 解决方案。

---

## 9. 反样例 · Don'ts

- ❌ 任何紫色 / 蓝紫渐变。
- ❌ Inter / Poppins 等通用字体。
- ❌ 3 列等高 feature 卡 + 通用 Lucide 图标。
- ❌ "Trusted by"、"Get Started" 类填充段。
- ❌ 在组件里写 `text-white` / `bg-black` / 任何 hex。
- ❌ Hero 配 2 个同权重 CTA（必须主 1 + 次 1 + ghost 1）。

---

## 10. 落地清单 · Implementation Checklist

- [x] `src/styles.css` 写入 Paper & Ink token + utilities。
- [x] `__root.tsx` 注入 Instrument Serif / Work Sans / JetBrains Mono / Noto Serif SC。
- [x] `site-shell.tsx` 全站统一 Header + Footer。
- [x] `/`、`/works`、`/now`、`/about`、`/blog` 五个路由独立 SEO。
- [x] `sitemap.xml` + `robots.txt`。
- [ ] 接入真实博客数据源（Markdown / CMS）后替换 `/blog` 假数据。
