<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   首页区块 · 价值主张 Why（块类型 = prose）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  | @updated   2026-06-17 17:35:00
  +----------------------------------------------------------------------
  块类型 = prose。数据源由 i18n key 改为 api/兜底 props.block（M6-D schema 驱动）。
-->
<script setup lang="ts">
defineProps<{ block: Record<string, any> }>()
</script>

<template>
  <section class="why bx-section">
    <div class="bx-container why__inner">
      <h2 class="why__title bx-reveal" v-reveal>{{ block.title }}</h2>
      <p class="why__body bx-reveal" v-reveal="120">{{ block.body }}</p>
    </div>
  </section>
</template>

<style scoped>
.why__inner {
  max-width: 820px;
  text-align: center;
  margin-inline: auto;
}
.why__title {
  font-family: var(--bx-font-brand);
  font-size: var(--bx-fs-section);
  font-weight: 700;
  line-height: 1.22;
  letter-spacing: -0.01em;
}
.why__body {
  margin-top: var(--bx-space-5);
  font-size: var(--bx-fs-lg);
  color: var(--bx-text-2);
}
</style>
