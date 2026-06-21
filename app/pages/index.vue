<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   官网首页（SSG build 时消费 api /pages/home schema 渲染 + 构建兜底 + 每页 SEO meta）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  | @updated   2026-06-18（B1-② 渲染管线抽共享 PageRenderer 复用）
  | @updated   2026-06-21（C2 ③-②：home 接入 seo 优先，未填 seo 则 SEO 逐字不变守红线）
  +----------------------------------------------------------------------
  M6-D（ADR-23）：build 时按 locale 拉 ${apiBase}/api/v1/pages/home?lang= 渲染 8 区块组件；
  api 不可达/空 → 回退内置 defaultHome（resolveBlocksByLang 解析），nuxt generate 不因后端宕机失败。
  SEO 不变：沿用 M6-A 站点级 i18n 文案（不用 bx_page.title 后台管理标签）。
  B1-②：渲染管线抽为共享 <PageRenderer>（与 pages/[slug].vue 共用），此处仅取数 + SEO。
-->
<script setup lang="ts">
import { defaultHome } from '~/data/defaultHome'
import { resolveBlocksByLang } from '~/utils/resolveBlocks'
import type { ApiBlock, ApiPageSeo } from '~/types/page'
import { pickSeoString, resolveOgImage } from '~/utils/pageSeo'

const { t, locale } = useI18n()
const config = useRuntimeConfig()

interface PageResponse {
  code: number
  data?: { slug?: string; title?: string; blocks?: ApiBlock[]; seo?: ApiPageSeo | null }
}

// SSG build 时按 locale 取数（服务端拉取，无 CORS）；key 含 locale 防两语言串用。
// 取数失败/空 → 回退内置兜底（seo:null），useAsyncData handler 内 try/catch 保证 generate EXIT 0（硬指标）。
const { data: home } = await useAsyncData<{ blocks: ApiBlock[]; seo: ApiPageSeo | null }>(
  `home-blocks-${locale.value}`,
  async () => {
    const lang = locale.value
    const apiBase = config.public.apiBase as string
    try {
      const res = await $fetch<PageResponse>(`${apiBase}/api/v1/pages/home`, {
        query: { lang },
        timeout: 5000,
        retry: 0,
      })
      const apiBlocks = res?.data?.blocks
      if (res?.code === 0 && Array.isArray(apiBlocks) && apiBlocks.length > 0) {
        return { blocks: apiBlocks, seo: res.data?.seo ?? null }
      }
      console.warn('[home] api 返回空或非 0 code，使用内置默认内容')
    } catch (err) {
      console.warn('[home] api 不可达，使用内置默认内容：', (err as Error)?.message)
    }
    return { blocks: resolveBlocksByLang(defaultHome, lang) as ApiBlock[], seo: null }
  },
)
const blocks = computed<ApiBlock[]>(() => home.value?.blocks ?? [])

// SEO（C2 ③-②）：home 接入页面 seo 优先 + 回退。守红线——未填 seo（seo:null）则 head 与 M6-A 现状逐字一致
// （站点级 i18n t('site.title')/t('site.description') + 默认 og 图）；仅当 home 填了 seo 才覆盖。
const siteConfig = useSiteConfig()
const seo = computed<ApiPageSeo | null>(() => home.value?.seo ?? null)
const seoTitle = computed(() => pickSeoString(seo.value?.seo_title) || t('site.title'))
const seoDescription = computed(() => pickSeoString(seo.value?.seo_description) || t('site.description'))
const ogImage = computed(() => resolveOgImage(seo.value?.og_image, siteConfig.url as string))

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogType: 'website',
  ogImage: () => ogImage.value,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => ogImage.value,
})
</script>

<template>
  <div class="home">
    <PageRenderer :blocks="blocks" />
  </div>
</template>
