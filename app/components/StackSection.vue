<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   首页区块 · 技术栈 Stack（标题 + 说明 + 技术徽章，块类型 = badge-list）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  | @updated   2026-06-17 17:35:00
  +----------------------------------------------------------------------
  块类型 = badge-list。标题/说明/徽章由 i18n key 改为 api/兜底 props.block.items（{label}）。
-->
<script setup lang="ts">
const props = defineProps<{ block: Record<string, any> }>()

const stackItems = computed(() =>
  ((props.block.items ?? []) as { label: string }[]).map((s) => s.label),
)
</script>

<template>
  <section id="stack" class="stk bx-section">
    <div class="bx-container stk__inner">
      <div class="bx-section__head bx-reveal" v-reveal>
        <h2 class="bx-section__title">{{ block.title }}</h2>
        <p v-if="block.caption" class="bx-section__desc">{{ block.caption }}</p>
      </div>

      <ul class="stk__list bx-reveal" v-reveal="120">
        <li v-for="(item, i) in stackItems" :key="i" class="stk__badge">
          <span class="stk__dot" aria-hidden="true" />
          <span class="bx-code">{{ item }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.stk__inner {
  text-align: center;
}
.stk__inner .bx-section__head {
  margin-inline: auto;
}
.stk__list {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
}
.stk__badge {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 20px;
  font-size: var(--bx-fs-base);
  color: var(--bx-text);
  border: 1px solid var(--bx-border);
  border-radius: var(--bx-radius);
  background: var(--bx-surface);
  transition: border-color 0.3s var(--bx-ease), transform 0.3s var(--bx-ease);
}
.stk__badge:hover {
  border-color: var(--bx-border-brand);
  transform: translateY(-3px);
}
.stk__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--bx-grad);
}
</style>
