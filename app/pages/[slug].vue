<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   官网通用页面 /[slug]（SSG build 时按 slug+locale 拉 api 渲染 + C1 SEO + 404 + home 重定向）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-18
  | @updated   2026-06-21（C2 ③-②：head 优先用页面 seo + 回退链，og:image 绝对化）
  +----------------------------------------------------------------------
  B1-②（ADR-24/ADR-23）：@nuxtjs/i18n prefix_except_default 自动产 /<slug>（中）与 /en/<slug>（英）两路由；
  setup 按 slug+当前 locale 拉 ${apiBase}/api/v1/pages/:slug?lang= → 复用 <PageRenderer> 渲染（与首页同管线）。
  预渲染清单由 nuxt.config nitro prerender:routes 钩子在 build 期枚举 B1-① /api/v1/pages（已排除 home）。
  slug 不存在/未发布 → M6-B 返 404 → createError(404) 走 error.vue；slug===home → 301 跳 /（避免重复内容）。
  SEO（C1 最小）：title/description 从 hero 块派生；canonical/hreflang/og:url 沿用 app.vue useLocaleHead i18n 自动注入。
-->
<script setup lang="ts">
import type { ApiBlock, ApiPageSeo } from '~/types/page'
import { pickSeoString, resolveOgImage } from '~/utils/pageSeo'

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const site = useSiteConfig()

const slug = String(route.params.slug ?? '')

// home 排除：运行时直敲 /home、/en/home → 301 跳本地化首页（/ 或 /en），避免与首页重复内容/canonical 冲突。
// 预渲染层（nuxt.config 钩子）已跳过 home，故 build 期不会产 /home 静态页；此处仅运行时兜底。
if (slug === 'home') {
  await navigateTo(localePath('/'), { redirectCode: 301, replace: true })
}

interface PageData {
  slug?: string
  title?: string
  blocks?: ApiBlock[]
  seo?: ApiPageSeo | null
}
interface PageResponse {
  code: number
  data?: PageData
}

// 按 slug + locale 取单页渲染（M6-B 已按 lang 解析为字符串）；key 含 slug+lang 防串用。
// 命中 → 返 data；不存在/未发布（M6-B 返 HTTP 200 + 业务码 404xxx，$fetch 不抛）→ 返 null；
// 网络异常 → $fetch 抛 → useAsyncData 收入 error。两种缺失都在 setup 作用域统一抛 createError(404)。
const { data: page, error } = await useAsyncData<PageData | null>(
  `page-${slug}-${locale.value}`,
  async () => {
    const lang = locale.value === 'en' ? 'en' : 'zh'
    const apiBase = config.public.apiBase as string
    const res = await $fetch<PageResponse>(`${apiBase}/api/v1/pages/${slug}`, {
      query: { lang },
      timeout: 5000,
      retry: 0,
    })
    return res?.code === 0 && res.data && Array.isArray(res.data.blocks) ? res.data : null
  },
)

// 在 setup 作用域抛（而非 handler 内）——确保中止渲染、置 HTTP 404、走 error.vue（handler 内抛会被 useAsyncData 吞为 error.value、页面仍以空态 200 渲染）。
if (error.value || !page.value) {
  if (error.value) console.warn(`[slug:${slug}] api 取数失败：`, error.value.message)
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

const blocks = computed<ApiBlock[]>(() => page.value?.blocks ?? [])

// ===== C1 SEO（hero 派生）=====
// blocks 已 lang 解析为字符串：hero.title/subtitle、prose.body 均为字符串。
function firstBlock(type: string): Record<string, unknown> | undefined {
  return blocks.value.find((b) => b?.type === type)
}
function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}
function truncate(s: string, max = 150): string {
  return s.length > max ? s.slice(0, max).trimEnd() + '…' : s
}

// title 取值链（C2 ③-②）：seo.seo_title → hero.title → 单页接口 data.title（后台页面名，M6-B 确返）
// → 美化 slug；统一拼站点名后缀。seo 为 null/未填 → 链同 C1 现状（hero 派生）。
const prettySlug = computed(() =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
)
const pageTitle = computed(() => {
  const hero = firstBlock('hero')
  return (
    pickSeoString(page.value?.seo?.seo_title) ||
    asString(hero?.title) ||
    asString(page.value?.title) ||
    prettySlug.value
  )
})
const fullTitle = computed(() => `${pageTitle.value} · ${site.name}`)

// description 取值链（C2 ③-②）：seo.seo_description → hero.subtitle → 首个 prose.body 截断 ~150 → 站点默认描述。
const { t } = useI18n()
const description = computed(() => {
  const hero = firstBlock('hero')
  const prose = firstBlock('prose')
  return (
    pickSeoString(page.value?.seo?.seo_description) ||
    asString(hero?.subtitle) ||
    truncate(asString(prose?.body)) ||
    t('site.description')
  )
})

// og:image（C2 ③-②）：seo.og_image（绝对化：http 原样 / 相对用 siteUrl 拼）→ 站点默认图绝对址。
const ogImage = computed(() => resolveOgImage(page.value?.seo?.og_image, site.url as string))
// og:url 取当前路由绝对 URL（与 i18n 注入的 canonical 同址：/<slug> 或 /en/<slug>）。
const ogUrl = computed(() => `${site.url}${route.path}`)

// canonical / hreflang / og:locale 由 app.vue useLocaleHead 按当前路由 i18n 自动注入（与首页一致）；
// 此处设页面级 title/description/og:*（含 og:url=canonical 绝对址）/twitter（镜像 index.vue 范式 + C1）。
useSeoMeta({
  title: () => fullTitle.value,
  description: () => description.value,
  ogTitle: () => fullTitle.value,
  ogDescription: () => description.value,
  ogType: 'website',
  ogUrl: () => ogUrl.value,
  ogImage: () => ogImage.value,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterTitle: () => fullTitle.value,
  twitterDescription: () => description.value,
  twitterImage: () => ogImage.value,
})
</script>

<template>
  <div class="page">
    <PageRenderer :blocks="blocks" />
  </div>
</template>
