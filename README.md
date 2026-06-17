# BenXinAdmin 官网（benxin-admin-site）

> BenXinAdmin 的对外门面官网 —— Nuxt 4 + i18n（中/英）+ 高端科技风暗色静态首页。
> 这是 BenXinAdmin 四仓之一；底座主仓见 [benxin-admin-server](https://github.com/BenXinAdmin-PHP/benxin-admin-server)。

## 技术栈

- **Nuxt 4**（Vue 3 + TypeScript + Vite 8）
- **@nuxtjs/i18n**：中文默认 `/`、英文 `/en`（`prefix_except_default`），所有文案走 locale key
- **SEO**：允许收录 + 多语言 hreflang + sitemap + robots（`@nuxtjs/sitemap` / `@nuxtjs/robots`）
- **视觉**：原生 CSS + design token（语义化 `--bx-*`）+ 纯 CSS 极光（Aurora），暗色单主题，品牌蓝 `#2b6fff`
- **字体**：全 OFL 可商用、自托管（无第三方 CDN）——Geist / Geist Mono（Vercel，OFL-1.1）+ 思源黑体 SC 子集（仅品牌标题）

## 起步

```bash
npm install
npm run dev        # 本地开发 http://localhost:3000
npm run generate   # SSG 静态产物（.output/public）
npm run preview    # 预览构建产物
```

> 上线时设置规范域名：环境变量 `NUXT_PUBLIC_SITE_URL=https://你的域名`（用于 hreflang / sitemap / canonical / OG 绝对地址）。

## 目录

```
app/
  components/    # 首页区块组件（Hero/Features/Moat/Security/Stack/Showcase/Cta/SiteHeader/SiteFooter/LangSwitch/AuroraBg）
  pages/         # index.vue（首页，消费各区块 + i18n key）
  plugins/       # v-reveal scroll-reveal 指令
  assets/styles/ # fonts / tokens / base / aurora
  utils/         # 外链常量
i18n/
  locales/       # zh.json / en.json
  i18n.config.ts
public/
  fonts/         # 自托管 woff2 + OFL 协议存档
  og/            # OG 分享图
```

## 资源合规（§10）

- 字体：仅 OFL 可商用、自托管 woff2，无 Google Fonts 等第三方 CDN 在线引用；OFL 协议随字体存档于 `public/fonts/`。
- 图标：自绘 stroke SVG（零版权）。
- 图片：截图墙为自绘 CSS/SVG 占位，OG 图自绘渐变 + 几何（零版权）；真实截图后补。
- 极光背景：纯 CSS 极光（零版权），尊重 `prefers-reduced-motion`。

## 协议

[Apache-2.0](./LICENSE) · © 2026 BenXinAdmin
