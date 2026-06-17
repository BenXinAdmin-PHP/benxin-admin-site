<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   官网首页（消费各区块组件 + i18n key + 每页 SEO meta）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  +----------------------------------------------------------------------
  本阶段区块内容写死走 locale；M6-D 接入 schema 驱动动态渲染。
-->
<script setup lang="ts">
const { t } = useI18n()
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
    <HeroSection />
    <WhySection />
    <FeaturesSection />
    <MoatSection />
    <SecuritySection />
    <StackSection />
    <ShowcaseSection />
    <CtaSection />
  </div>
</template>
