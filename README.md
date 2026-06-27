# sanage.xyz

> 三阿哥的个人品牌站 —— 把有意思的想法，做成真实能玩的东西。

**在线地址：** [https://sanage.xyz](https://sanage.xyz)

---

## 这是什么

sanage.xyz 是整个 Sanage 生态的品牌枢纽和流量收口。它本身是一个极简的静态站点，不承载任何业务功能，只做一件事：**引导用户进入各个子站**。

### Sanage 生态

| 子站 | 地址 | 简介 |
|------|------|------|
| Quiz 测评室 | [quiz.sanage.xyz](https://quiz.sanage.xyz) | 谍战人格测试 · 武林外传 · 肤色诊断 |
| Bu 占卜室 | [bu.sanage.xyz](https://bu.sanage.xyz) | 数字化多元占卜 · 周易数理 |
| ActionOS | [github.com/sanage-lab/action](https://github.com/sanage-lab/action) | 个人执行系统，开源自部署 |
| 博客 | [blog.sanage.xyz](https://blog.sanage.xyz) | 产品思考 · 独立开发 · 影视随笔 |

---

## 技术栈

| 层级 | 技术 |
|------|------|
| **平台** | [Cloudflare Pages](https://pages.cloudflare.com/)（纯静态，无 Functions / KV） |
| **框架** | [Astro](https://astro.build/) v5（SSG） |
| **样式** | [Tailwind CSS](https://tailwindcss.com/) v4（Vite 插件） |
| **部署** | Git push → Cloudflare Pages CI 自动构建部署 |

---

## 项目结构

```
├── src/
│   ├── pages/
│   │   ├── index.astro       # 首页（Hero + 生态索引）
│   │   ├── works/
│   │   │   └── index.astro   # 作品索引页
│   │   ├── about.astro       # 关于页
│   │   └── 404.astro
│   ├── layouts/
│   │   └── BaseLayout.astro  # 基础布局（Nav、Footer、SEO、GA）
│   ├── components/
│   │   ├── Navigation.astro
│   │   ├── Footer.astro
│   │   └── seo/              # Meta、OG、Schema 组件
│   ├── content/
│   │   └── works/            # 作品数据（JSON，Astro Content Collections）
│   │       ├── quiz.json
│   │       ├── bu.json
│   │       └── action.json
│   └── styles/
│       └── global.css        # 全局样式 + 动效工具类
├── public/
│   └── images/og/            # OG 封面图
├── wrangler.jsonc.example    # Wrangler 配置模板（复制后重命名为 wrangler.jsonc）
├── astro.config.mjs
└── package.json
```

---

## 本地开发

**前置条件：** Node.js >= 18、pnpm >= 9

```bash
pnpm install
pnpm dev        # 启动开发服务器 → http://localhost:4321
```

---

## 部署

### 方式一：Git Push 自动部署（推荐）

在 Cloudflare Dashboard 配置一次，之后每次 `git push` 自动触发：

1. **Workers & Pages** → 找到项目 → **Settings → Build & Deployments**
2. 连接 GitHub 仓库
3. 填入构建配置：
   - Build command：`pnpm build`
   - Build output directory：`dist`
   - Node.js version：`22`

### 方式二：本地手动部署

```bash
# 复制配置模板
cp wrangler.jsonc.example wrangler.jsonc
# （wrangler.jsonc 已在 .gitignore 中，不会提交）

pnpm deploy     # 等同于：pnpm build && wrangler pages deploy dist
```

---

## 个性化配置

如果你 fork 了本项目，请替换以下内容：

| 文件 | 需要替换的内容 |
|------|--------------|
| `src/layouts/BaseLayout.astro` | Google AdSense ID（`ca-pub-*`）、GTM ID（`GTM-*`）、GA4 ID（`G-*`） |
| `src/content/works/*.json` | 各子站的链接和描述 |
| `public/images/og/` | OG 封面图 |
| `src/pages/about.astro` | 个人介绍内容 |

---

## 开源协议

[MIT](LICENSE)
