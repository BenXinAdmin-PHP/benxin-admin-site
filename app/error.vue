<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   官网错误页（404/通用，暗色科技风，中英文案 + 回首页；error.vue 替换 app.vue 渲染）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-18
  +----------------------------------------------------------------------
  B1-②：未知/未发布 slug → [slug].vue createError(404) → 走此页。error.vue 在根渲染（不经 app.vue），
  故自带最简 chrome；复用 design token 与 AuroraBg 保持站点暗色风。文案中英随当前 locale。
-->
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()

const is404 = computed(() => props.error?.statusCode === 404)
const code = computed(() => props.error?.statusCode ?? 500)
const title = computed(() => (is404.value ? t('error.404Title') : t('error.genericTitle')))
const desc = computed(() => (is404.value ? t('error.404Desc') : t('error.genericDesc')))

// 回首页：clearError 清错误态并跳转本地化首页（/ 或 /en）。
function goHome() {
  clearError({ redirect: localePath('/') })
}
</script>

<template>
  <div class="bx-err">
    <AuroraBg />
    <main class="bx-err__main">
      <p class="bx-err__code">{{ code }}</p>
      <h1 class="bx-err__title">{{ title }}</h1>
      <p class="bx-err__desc">{{ desc }}</p>
      <button class="bx-err__btn" type="button" @click="goHome">
        {{ t('error.backHome') }}
      </button>
    </main>
  </div>
</template>

<style scoped>
.bx-err {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--bx-bg);
  color: var(--bx-text);
  overflow: hidden;
}
.bx-err__main {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: var(--bx-space-6);
  max-width: 560px;
}
.bx-err__code {
  font-family: var(--bx-font-mono);
  font-size: clamp(4rem, 14vw, 8rem);
  line-height: 1;
  font-weight: 700;
  margin: 0;
  background: var(--bx-grad-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.bx-err__title {
  font-family: var(--bx-font-brand);
  font-size: var(--bx-fs-2xl);
  margin: var(--bx-space-4) 0 var(--bx-space-3);
}
.bx-err__desc {
  color: var(--bx-text-2);
  font-size: var(--bx-fs-lg);
  margin: 0 0 var(--bx-space-6);
}
.bx-err__btn {
  display: inline-block;
  padding: 12px 28px;
  border: none;
  border-radius: var(--bx-radius-pill);
  background: var(--bx-grad);
  color: var(--bx-text-on-brand);
  font-size: var(--bx-fs-base);
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--bx-shadow-brand);
  transition: transform var(--bx-dur) var(--bx-ease);
}
.bx-err__btn:hover {
  transform: translateY(-2px);
}
</style>
