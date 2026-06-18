<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   官网首页（SSG build 时消费 api /pages/home schema 渲染 + 构建兜底 + 每页 SEO meta）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  | @updated   2026-06-18（B1-② 渲染管线抽共享 PageRenderer 复用）
  +----------------------------------------------------------------------
  M6-D（ADR-23）：build 时按 locale 拉 ${apiBase}/api/v1/pages/home?lang= 渲染 8 区块组件；
  api 不可达/空 → 回退内置 defaultHome（resolveBlocksByLang 解析），nuxt generate 不因后端宕机失败。
  SEO 不变：沿用 M6-A 站点级 i18n 文案（不用 bx_page.title 后台管理标签）。
  B1-②：渲染管线抽为共享 <PageRenderer>（与 pages/[slug].vue 共用），此处仅取数 + SEO。
-->
<script setup lang="ts">
import { defaultHome } from '~/data/defaultHome'
import { resolveBlocksByLang } from '~/utils/resolveBlocks'
import type { ApiBlock } from '~/types/page'

const { t, locale } = useI18n()
const config = useRuntimeConfig()

interface PageResponse {
  code: number
  data?: { slug?: string; title?: string; blocks?: ApiBlock[] }
}

// SSG build 时按 locale 取数（服务端拉取，无 CORS）；key 含 locale 防两语言串用。
// 取数失败/空 → 回退内置兜底，useAsyncData handler 内 try/catch 保证 generate EXIT 0（硬指标）。
const { data: blocks } = await useAsyncData<ApiBlock[]>(
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
        return apiBlocks
      }
      console.warn('[home] api 返回空或非 0 code，使用内置默认内容')
    } catch (err) {
      console.warn('[home] api 不可达，使用内置默认内容：', (err as Error)?.message)
    }
    return resolveBlocksByLang(defaultHome, lang) as ApiBlock[]
  },
)

// SEO 不变（沿用 M6-A 站点级 i18n；不用 bx_page.title）
const siteConfig = useSiteConfig()
const ogImage = `${siteConfig.url}/og/og-default.png`

useSeoMeta({
  title: () => t('site.title'),
  description: () => t('site.description'),
  ogTitle: () => t('site.title'),
  ogDescription: () => t('site.description'),
  ogType: 'website',
  ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('site.title'),
  twitterDescription: () => t('site.description'),
  twitterImage: ogImage,
})
</script>

<template>
  <div class="home">
    <PageRenderer :blocks="blocks" />
  </div>
</template>
