<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   官网根组件（全局布局 + i18n SEO head：hreflang/og:locale/html lang）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  +----------------------------------------------------------------------
-->
<script setup lang="ts">
const { t } = useI18n()

// @nuxtjs/i18n 自动注入 <html lang> / hreflang 互链 / og:locale
const localeHead = useLocaleHead()
useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: localeHead.value.link,
  meta: localeHead.value.meta,
}))
</script>

<template>
  <div class="bx-app">
    <a class="bx-skip" href="#main">{{ t('common.skipToContent') }}</a>
    <SiteHeader />
    <main id="main">
      <NuxtPage />
    </main>
    <SiteFooter />
  </div>
</template>
