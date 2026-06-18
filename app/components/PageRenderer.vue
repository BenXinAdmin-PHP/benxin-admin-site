<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   通用页面区块渲染器（blocks 数组 → blockTypeMap → 8 区块组件，home 与 [slug] 共用）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-18
  +----------------------------------------------------------------------
  B1-②（ADR-23/ADR-24）：把 M6-D index.vue 内联的「blockTypeMap + v-for 渲染」抽为共享组件，
  供首页 index.vue 与通用页 pages/[slug].vue 复用，消除重复、保证两处渲染完全一致。
  入参 blocks 为已按 lang 解析的字符串形态区块数组（api renderBySlug / resolveBlocksByLang 产出）；
  未知 type 跳过不渲染（沿用 M6-D 容错，向前兼容后端新增块）。
-->
<script setup lang="ts">
import type { Component } from 'vue'
import type { ApiBlock } from '~/types/page'
import HeroSection from '~/components/HeroSection.vue'
import WhySection from '~/components/WhySection.vue'
import FeaturesSection from '~/components/FeaturesSection.vue'
import MoatSection from '~/components/MoatSection.vue'
import SecuritySection from '~/components/SecuritySection.vue'
import StackSection from '~/components/StackSection.vue'
import ShowcaseSection from '~/components/ShowcaseSection.vue'
import CtaSection from '~/components/CtaSection.vue'

const props = defineProps<{ blocks?: ApiBlock[] | null }>()

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

// 仅渲染白名单 type（未知 type 跳过、console.warn，向前兼容后端新增块）
const renderBlocks = computed(() =>
  (props.blocks ?? []).filter((b) => {
    if (b && blockTypeMap[b.type]) return true
    console.warn('[render] 跳过未知区块类型：', b?.type)
    return false
  }),
)
</script>

<template>
  <component
    :is="blockTypeMap[block.type]"
    v-for="(block, i) in renderBlocks"
    :key="i"
    :block="block"
  />
</template>
