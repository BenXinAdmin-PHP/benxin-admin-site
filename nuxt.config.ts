// https://nuxt.com/docs/api/configuration/nuxt-config
//
// +----------------------------------------------------------------------
// | @project   BenXinAdmin
// | @mission   官网 Nuxt 配置（i18n 中/英 + SEO 允许收录 + sitemap/robots + 自托管字体 + api 渲染基址）
// | @author    仗键天涯(daxing)
// | @email     3442535897@qq.com
// | @date      2026-06-17
// | @updated   2026-06-17 17:35:00
// +----------------------------------------------------------------------

// 站点规范 URL：用于 hreflang / sitemap / canonical。
// 真实域名待定，先用占位，可经 NUXT_PUBLIC_SITE_URL 环境变量覆盖（daxing 上线时设定）。
const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'https://www.benxinadmin.com'

// 后端 api 基址：M6-D 首页 SSG build 时拉 ${API_BASE}/api/v1/pages/home?lang= 渲染（ADR-23）。
// dev 默认指本地 server（§12 端口 8801）；prod 由 daxing 上线经 NUXT_PUBLIC_API_BASE 设真实后端。
// api 不可达时首页回退内置兜底默认内容，nuxt generate 不因后端宕机而失败（硬指标）。
const API_BASE = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8801'

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
  },

  css: [
    '~/assets/styles/fonts.css',
    '~/assets/styles/tokens.css',
    '~/assets/styles/base.css',
    '~/assets/styles/aurora.css',
  ],

  // 站点级配置（@nuxtjs/sitemap + @nuxtjs/robots 共用）
  site: {
    url: SITE_URL,
    name: 'BenXinAdmin',
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
