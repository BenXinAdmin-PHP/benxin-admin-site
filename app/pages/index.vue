<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   官网首页（SSG build 时消费 api /pages/home schema 渲染 + 构建兜底 + 每页 SEO meta）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  | @updated   2026-06-17 17:35:00
  +----------------------------------------------------------------------
  M6-D（ADR-23）：build 时按 locale 拉 ${apiBase}/api/v1/pages/home?lang= 渲染 8 区块组件；
  api 不可达/空 → 回退内置 defaultHome（resolveBlocksByLang 解析），nuxt generate 不因后端宕机失败。
  SEO 不变：沿用 M6-A 站点级 i18n 文案（不用 bx_page.title 后台管理标签）。
-->
<script setup lang="ts">
import type { Component } from 'vue'
import { defaultHome } from '~/data/defaultHome'
import { resolveBlocksByLang } from '~/utils/resolveBlocks'
import HeroSection from '~/components/HeroSection.vue'
import WhySection from '~/components/WhySection.vue'
import FeaturesSection from '~/components/FeaturesSection.vue'
import MoatSection from '~/components/MoatSection.vue'
import SecuritySection from '~/components/SecuritySection.vue'
import StackSection from '~/components/StackSection.vue'
import ShowcaseSection from '~/components/ShowcaseSection.vue'
import CtaSection from '~/components/CtaSection.vue'

const { t, locale } = useI18n()
const config = useRuntimeConfig()

// 区块 type → 组件 映射（与 M6-B 白名单 8 type 对齐；未知 type 跳过不渲染）。
// 显式导入组件对象（非字符串名）——SSG 下 <component :is="字符串"> 不解析自动导入组件。
const blockTypeMap: Record<string, Component> = {
  hero: HeroSection,
  prose: WhySection,
  'feature-grid': FeaturesSection,
  moat: MoatSection,
  security: SecuritySection,
  'badge-list': StackSection,
  showcase: ShowcaseSection,
  cta: CtaSection,
}

interface ApiBlock extends Record<string, unknown> {
  type: string
}
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

// 仅渲染白名单 type（未知 type 跳过、console.warn，向前兼容后端新增块）
const renderBlocks = computed(() =>
  (blocks.value ?? []).filter((b) => {
    if (blockTypeMap[b?.type]) return true
    console.warn('[home] 跳过未知区块类型：', b?.type)
    return false
  }),
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
    <component
      :is="blockTypeMap[block.type]"
      v-for="(block, i) in renderBlocks"
      :key="i"
      :block="block"
    />
  </div>
</template>
