<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   首页区块 · 护城河叙事 Moat（块类型 = prose + code-badge）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  | @updated   2026-06-17 17:35:00
  +----------------------------------------------------------------------
  块类型 = moat。数据源由 i18n key 改为 api/兜底 props.block（M6-D schema 驱动）。
-->
<script setup lang="ts">
defineProps<{ block: Record<string, any> }>()
</script>

<template>
  <section id="moat" class="moat bx-section">
    <div class="bx-container">
      <div class="moat__card bx-card bx-reveal" v-reveal>
        <h2 class="moat__title">{{ block.title }}</h2>
        <p class="moat__body">{{ block.body }}</p>

        <div class="moat__verify" aria-hidden="true">
          <code class="bx-code">
            <span class="t-dim">$</span> bash verify.sh
            <span class="moat__arrow">→</span>
            <span class="t-ok">EXIT 0</span>
          </code>
          <span v-if="block.verifyCaption" class="moat__caption bx-code">{{ block.verifyCaption }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.moat__card {
  padding: 48px 44px;
  text-align: center;
}
.moat__title {
  font-family: var(--bx-font-brand);
  font-size: var(--bx-fs-section);
  font-weight: 700;
  line-height: 1.22;
  letter-spacing: -0.01em;
  max-width: 22ch;
  margin-inline: auto;
}
.moat__body {
  margin: var(--bx-space-5) auto 0;
  max-width: 64ch;
  font-size: var(--bx-fs-lg);
  color: var(--bx-text-2);
}
.moat__verify {
  margin-top: var(--bx-space-6);
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 14px;
}
.moat__verify code {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  font-size: var(--bx-fs-sm);
  border: 1px solid var(--bx-border);
  border-radius: var(--bx-radius-pill);
  background: rgba(8, 12, 22, 0.6);
  color: var(--bx-text);
}
.moat__arrow {
  color: var(--bx-text-3);
}
.t-ok {
  color: var(--bx-mint);
  font-weight: 700;
}
.t-dim {
  color: var(--bx-text-3);
}
.moat__caption {
  font-size: 12px;
  color: var(--bx-text-3);
}

@media (max-width: 720px) {
  .moat__card {
    padding: 32px 22px;
  }
}
</style>
