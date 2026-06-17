<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   语言切换器（中 / English，保持当前路由对应语言 URL）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  +----------------------------------------------------------------------
-->
<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n'

const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const localeList = computed(() => locales.value as LocaleObject[])
const shortLabel = (code: string) => (code === 'zh' ? '中' : 'EN')
</script>

<template>
  <nav class="lang" :aria-label="t('common.langSwitch')">
    <NuxtLink
      v-for="l in localeList"
      :key="l.code"
      :to="switchLocalePath(l.code)"
      class="lang__item"
      :class="{ 'is-active': l.code === locale }"
      :aria-current="l.code === locale ? 'true' : undefined"
      :hreflang="l.language"
    >
      {{ shortLabel(l.code) }}
    </NuxtLink>
  </nav>
</template>

<style scoped>
.lang {
  display: inline-flex;
  align-items: center;
  padding: 3px;
  gap: 2px;
  border: 1px solid var(--bx-border);
  border-radius: var(--bx-radius-pill);
  background: var(--bx-surface);
}
.lang__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 28px;
  padding-inline: 8px;
  font-size: var(--bx-fs-sm);
  font-weight: 600;
  color: var(--bx-text-3);
  border-radius: var(--bx-radius-pill);
  transition: color 0.25s var(--bx-ease), background 0.25s var(--bx-ease);
}
.lang__item:hover {
  color: var(--bx-text);
}
.lang__item.is-active {
  color: var(--bx-text-on-brand);
  background: var(--bx-brand);
}
</style>
