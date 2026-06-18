// https://nuxt.com/docs/api/configuration/nuxt-config
//
// +----------------------------------------------------------------------
// | @project   BenXinAdmin
// | @mission   官网 Nuxt 配置（i18n 中/英 + SEO 允许收录 + sitemap/robots + 自托管字体 + api 渲染基址）
// | @author    仗键天涯(daxing)
// | @email     3442535897@qq.com
// | @date      2026-06-17
// | @updated   2026-06-18（B1-② 通用页 /[slug] 预渲染枚举钩子 + 动态 sitemap 源 + 构建兜底）
// +----------------------------------------------------------------------

// 站点规范 URL：用于 hreflang / sitemap / canonical。
// 真实域名待定，先用占位，可经 NUXT_PUBLIC_SITE_URL 环境变量覆盖（daxing 上线时设定）。
const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'https://www.benxinadmin.com'

// 后端 api 基址：M6-D 首页 SSG build 时拉 ${API_BASE}/api/v1/pages/home?lang= 渲染（ADR-23）。
// dev 默认指本地 server（§12 端口 8801）；prod 由 daxing 上线经 NUXT_PUBLIC_API_BASE 设真实后端。
// api 不可达时首页回退内置兜底默认内容，nuxt generate 不因后端宕机而失败（硬指标）。
const API_BASE = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8801'

// B1-②：build 期枚举 B1-① 已发布页清单（GET /api/v1/pages），供 nitro prerender:routes 钩子注入
// 通用页 /[slug] 预渲染路由。构建兜底（守 §1 硬指标）：超时/失败/非预期 → 返回 []，不阻断 nuxt generate。
// 排除 home（首页 / 与 /en 已由既有 prerender.routes 覆盖，带 defaultHome 兜底）。
async function fetchPublishedSlugs(): Promise<string[]> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 5000)
  try {
    const res = await fetch(`${API_BASE}/api/v1/pages`, { signal: ctrl.signal })
    if (!res.ok) {
      console.warn(`[prerender] /api/v1/pages 返回 HTTP ${res.status}，跳过 [slug] 枚举`)
      return []
    }
    const json = (await res.json()) as { code?: number; data?: Array<{ slug?: string }> }
    const list = Array.isArray(json?.data) ? json.data : []
    return list
      .map((p) => (typeof p?.slug === 'string' ? p.slug : ''))
      .filter((slug) => slug !== '' && slug !== 'home')
  } catch (err) {
    console.warn('[prerender] 拉已发布页清单失败，仅预渲染既有路由：', (err as Error)?.message)
    return []
  } finally {
    clearTimeout(timer)
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap', '@nuxtjs/robots'],

  // 公开运行时配置：apiBase 为公开后端地址（非密钥），可经 NUXT_PUBLIC_API_BASE 覆盖。
  runtimeConfig: {
    public: {
      apiBase: API_BASE,
    },
  },

  // 官网内容静态，优先 SSG（部署简单、收录稳定）；首页双语预渲染。
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en'],
    },
    // B1-②：build 期把已发布页（≠home）的中/英两路由注入预渲染集；
    // fetchPublishedSlugs 已含构建兜底，失败返回 [] → 不新增 [slug] 路由、generate 不挂。
    hooks: {
      async 'prerender:routes'(routes: Set<string>) {
        const slugs = await fetchPublishedSlugs()
        for (const slug of slugs) {
          routes.add(`/${slug}`)
          routes.add(`/en/${slug}`)
        }
        if (slugs.length > 0) {
          console.info(`[prerender] 注入 ${slugs.length} 个通用页（中/英各一）：${slugs.join(', ')}`)
        }
      },
    },
  },

  css: [
    '~/assets/styles/fonts.css',
    '~/assets/styles/tokens.css',
    '~/assets/styles/base.css',
    '~/assets/styles/aurora.css',
  ],

  // 站点级配置（@nuxtjs/sitemap + @nuxtjs/robots 共用）
  // SITE_URL 经 NUXT_PUBLIC_SITE_URL 覆盖，供 canonical/hreflang/og:url/sitemap loc 取绝对 URL。
  site: {
    url: SITE_URL,
    name: 'BenXinAdmin',
  },

  // B1-②：动态 sitemap 源——server route 在 build 期拉 B1-① 清单产已发布页（≠home）双语条目
  // （含 lastmod + i18n hreflang）；源拉取失败退化为仅既有静态条目（home），不阻断构建。
  sitemap: {
    sources: ['/__sitemap__/pages'],
  },

  // 官网允许收录（与后台 noindex 相反）
  robots: {
    allow: '/',
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'zh',
    baseUrl: SITE_URL,
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    bundle: {
      optimizeTranslationDirective: false,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'bx_lang',
      redirectOn: 'root',
      alwaysRedirect: false,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0a0e1a' },
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }],
    },
  },
})
