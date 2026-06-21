<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   通用页面区块渲染器（blocks 数组 → blockTypeMap → 区块组件 + richtext v-html，home/[slug]/preview 共用）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-18
  | @updated   2026-06-21（ADR-27-③：加 richtext 块 v-html 渲染 + sanitize 档区分正式页/预览）
  +----------------------------------------------------------------------
  B1-②（ADR-23/ADR-24）：把 M6-D index.vue 内联的「blockTypeMap + v-for 渲染」抽为共享组件，
  供首页 index.vue 与通用页 pages/[slug].vue 复用，消除重复、保证两处渲染完全一致。
  入参 blocks 为已按 lang 解析的字符串形态区块数组（api renderBySlug / resolveBlocksByLang 产出）；
  未知 type 跳过不渲染（沿用 M6-D 容错，向前兼容后端新增块）。

  ADR-27-③ richtext：本组件是全站唯一 v-html 落点，且仅对 richtext 这一 block type 开（其余 8 block 仍走
  结构化组件 / 插值转义，守「全程无 v-html」的明文唯一例外）。安全分档（守决策⑥ + 修订① D 项）：
  - 正式页（默认 sanitize=false）：richtext.html 来自公开渲染接口 = server cleanBuilderRichtext 已净化 → 信任不二次净化；
  - /preview（sanitize=true）：html 来自后台 postMessage 编辑态 = 未经 server 净化 → v-html 前必经客户端 DOMPurify（编辑态纵深防御防自伤）。
  DOMPurify 放行集对齐 server RICHTEXT_ALLOWED（防预览误剥致「预览≠正式」），禁 script/iframe/form/input/on*。
-->
<script setup lang="ts">
import type { Component } from 'vue'
import DOMPurify from 'dompurify'
import type { ApiBlock } from '~/types/page'
import HeroSection from '~/components/HeroSection.vue'
import WhySection from '~/components/WhySection.vue'
import FeaturesSection from '~/components/FeaturesSection.vue'
import MoatSection from '~/components/MoatSection.vue'
import SecuritySection from '~/components/SecuritySection.vue'
import StackSection from '~/components/StackSection.vue'
import ShowcaseSection from '~/components/ShowcaseSection.vue'
import CtaSection from '~/components/CtaSection.vue'

const props = withDefaults(
  defineProps<{
    blocks?: ApiBlock[] | null
    /** 是否对 richtext 做客户端 DOMPurify：正式页 false（信任 server）/ 预览 true（编辑态防自伤） */
    sanitize?: boolean
  }>(),
  { blocks: null, sanitize: false },
)

// 区块 type → 组件 映射（与 M6-B 白名单 8 type 对齐；richtext 不走映射、由本组件 v-html 内联渲染）。
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

/** 是否本组件可渲染的 type：8 结构化块 + richtext。 */
function isRenderable(type: string | undefined): boolean {
  return !!type && (type === 'richtext' || !!blockTypeMap[type])
}

// 仅渲染可识别 type（未知 type 跳过、console.warn，向前兼容后端新增块）
const renderBlocks = computed(() =>
  (props.blocks ?? []).filter((b) => {
    if (b && isRenderable(b.type)) return true
    console.warn('[render] 跳过未知区块类型：', b?.type)
    return false
  }),
)

/**
 * DOMPurify 放行集（仅预览态用）：对齐 server RICHTEXT_ALLOWED 标签 + 属性，避免预览误剥致「预览≠正式」。
 * 属性为扁平允许集（DOMPurify 不做按标签细分；预览仅防自伤、非权威门，足够）。
 * style 放行但不细控 CSS 属性（DOMPurify 无内置 CSS 属性白名单）——CSS 6 属性白名单由 server 最终把关。
 * 禁 script/iframe/form/input/on*：不在 ALLOWED_TAGS/ATTR 内即被 DOMPurify 剥除（默认亦禁）。
 */
const RICHTEXT_PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'span', 'strong', 'em', 'h2', 'h3', 'h4', 'ul', 'ol', 'li',
    'a', 'img', 'blockquote', 'code', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'video',
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'src', 'alt', 'colspan', 'rowspan', 'controls', 'style'],
}

/**
 * richtext 块 → 可 v-html 的 HTML 字符串（block.html 经 api/resolveBlocksByLang 已 lang 解析为字符串）。
 * sanitize=false：正式页信任 server 净化、原样返回；sanitize=true：预览态经 DOMPurify（仅客户端有 DOM）。
 */
function renderRichtext(block: ApiBlock): string {
  const html = typeof block.html === 'string' ? block.html : ''
  if (!html) return ''
  if (!props.sanitize) return html
  // 预览态：未经 server 净化，必经 DOMPurify；SSR 无 DOM 故仅客户端执行（/preview 本就 ClientOnly + 不预渲染）。
  return import.meta.client ? DOMPurify.sanitize(html, RICHTEXT_PURIFY_CONFIG) : ''
}
</script>

<template>
  <template v-for="(block, i) in renderBlocks" :key="i">
    <!-- richtext：全站唯一 v-html 落点（正式页信任 server / 预览经 DOMPurify，见 renderRichtext） -->
    <section v-if="block.type === 'richtext'" class="rich-text">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="rich-text__inner" v-html="renderRichtext(block)" />
    </section>
    <!-- 其余 8 结构化块：组件渲染、插值转义、无 v-html -->
    <component :is="blockTypeMap[block.type]" v-else :block="block" />
  </template>
</template>

<style scoped>
/* richtext 容器：暗色科技风 token 兜底排版；用户自设字色可能撞暗底（ADR-27 修订① 产品取舍，不强制覆盖）。 */
.rich-text {
  padding: var(--bx-space-6) var(--bx-space-4);
}
.rich-text__inner {
  max-width: var(--bx-container, 1080px);
  margin: 0 auto;
  color: var(--bx-text-2);
  font-size: var(--bx-fs-base);
  line-height: 1.8;
  word-break: break-word;
}
.rich-text__inner :deep(h2),
.rich-text__inner :deep(h3),
.rich-text__inner :deep(h4) {
  color: var(--bx-text);
  font-weight: 600;
  line-height: 1.3;
  margin: 1.4em 0 0.6em;
}
.rich-text__inner :deep(h2) { font-size: var(--bx-fs-xl, 1.6rem); }
.rich-text__inner :deep(h3) { font-size: var(--bx-fs-lg, 1.3rem); }
.rich-text__inner :deep(h4) { font-size: var(--bx-fs-md, 1.1rem); }
.rich-text__inner :deep(p) { margin: 0.8em 0; }
.rich-text__inner :deep(a) { color: var(--bx-brand, #6ea8fe); text-decoration: underline; }
.rich-text__inner :deep(ul),
.rich-text__inner :deep(ol) { padding-left: 1.6em; margin: 0.8em 0; }
.rich-text__inner :deep(li) { margin: 0.3em 0; }
.rich-text__inner :deep(blockquote) {
  margin: 1em 0;
  padding: 0.4em 1em;
  border-left: 3px solid var(--bx-border-brand, #3b6);
  background: var(--bx-surface-2, rgba(255, 255, 255, 0.03));
  color: var(--bx-text-3);
}
.rich-text__inner :deep(code) {
  padding: 0.15em 0.4em;
  border-radius: var(--bx-radius-sm, 4px);
  background: var(--bx-surface-2, rgba(255, 255, 255, 0.06));
  font-family: var(--bx-font-mono);
  font-size: 0.92em;
}
.rich-text__inner :deep(img),
.rich-text__inner :deep(video) {
  max-width: 100%;
  height: auto;
  border-radius: var(--bx-radius, 8px);
}
.rich-text__inner :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}
.rich-text__inner :deep(th),
.rich-text__inner :deep(td) {
  border: 1px solid var(--bx-border, rgba(255, 255, 255, 0.12));
  padding: 0.5em 0.8em;
  text-align: left;
}
.rich-text__inner :deep(th) {
  background: var(--bx-surface-2, rgba(255, 255, 255, 0.04));
  color: var(--bx-text);
  font-weight: 600;
}
</style>
