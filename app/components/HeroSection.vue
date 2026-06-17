<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   首页区块 · Hero（极光背景 + 品牌大标题 + 双 CTA + 装饰终端）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  | @updated   2026-06-17 17:35:00
  +----------------------------------------------------------------------
  块类型 = hero。数据源由 i18n key 改为 api/兜底 props.block（M6-D schema 驱动）。
-->
<script setup lang="ts">
defineProps<{ block: Record<string, any> }>()

// 外链（http/https）开新标签页；站内锚点同页跳转——保持 M6-A 行为。
const isExternal = (href?: string) => !!href && /^https?:\/\//.test(href)
</script>

<template>
  <section class="hero">
    <AuroraBg />
    <div class="bx-container hero__inner">
      <p class="bx-eyebrow bx-reveal" v-reveal>{{ block.eyebrow }}</p>

      <h1 class="hero__title bx-reveal" v-reveal="80">
        <span class="bx-grad-text">{{ block.title }}</span>
      </h1>

      <p class="hero__subtitle bx-reveal" v-reveal="160">{{ block.subtitle }}</p>

      <div class="hero__actions bx-reveal" v-reveal="240">
        <a
          :href="block.ctaPrimary?.href || '#'"
          :target="isExternal(block.ctaPrimary?.href) ? '_blank' : undefined"
          :rel="isExternal(block.ctaPrimary?.href) ? 'noopener' : undefined"
          class="bx-btn bx-btn--primary"
        >
          {{ block.ctaPrimary?.text }}
        </a>
        <a
          :href="block.ctaSecondary?.href || '#'"
          :target="isExternal(block.ctaSecondary?.href) ? '_blank' : undefined"
          :rel="isExternal(block.ctaSecondary?.href) ? 'noopener' : undefined"
          class="bx-btn bx-btn--ghost"
        >
          {{ block.ctaSecondary?.text }}
        </a>
      </div>

      <!-- 装饰性终端（等宽字体，零数据，纯视觉） -->
      <div class="hero__terminal bx-reveal" v-reveal="320" aria-hidden="true">
        <div class="hero__termbar">
          <span /><span /><span />
          <em class="bx-code">benxin-admin-server</em>
        </div>
        <pre class="hero__termbody bx-code"><span class="t-dim">$</span> php think bx:make post
<span class="t-ok">✓</span> Model / Controller / Service / Validate
<span class="t-ok">✓</span> route + menu perms seeder
<span class="t-ok">✓</span> web: list / form / assign dialog
<span class="t-dim">$</span> bash verify.sh
<span class="t-ok">EXIT 0</span> <span class="t-dim">— generated == hand-written</span></pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding-top: calc(var(--bx-nav-h) + 48px);
  padding-bottom: var(--bx-space-9);
  overflow: hidden;
}
.hero__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.hero__title {
  margin-top: var(--bx-space-5);
  font-family: var(--bx-font-brand);
  font-size: var(--bx-fs-hero);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.02em;
  max-width: 16ch;
}
.hero__subtitle {
  margin-top: var(--bx-space-5);
  max-width: 60ch;
  font-size: var(--bx-fs-lg);
  color: var(--bx-text-2);
}
.hero__actions {
  margin-top: var(--bx-space-6);
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
}
.hero__terminal {
  margin-top: var(--bx-space-8);
  width: min(640px, 100%);
  text-align: left;
  border: 1px solid var(--bx-border);
  border-radius: var(--bx-radius);
  background: rgba(8, 12, 22, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: var(--bx-shadow);
  overflow: hidden;
}
.hero__termbar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--bx-border);
  background: var(--bx-surface);
}
.hero__termbar span {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--bx-border-strong);
}
.hero__termbar span:nth-child(1) {
  background: #ff5f57;
}
.hero__termbar span:nth-child(2) {
  background: #febc2e;
}
.hero__termbar span:nth-child(3) {
  background: #28c840;
}
.hero__termbar em {
  margin-left: auto;
  font-style: normal;
  color: var(--bx-text-3);
  font-size: 12px;
}
.hero__termbody {
  margin: 0;
  padding: 16px 18px;
  font-size: 13px;
  line-height: 1.9;
  white-space: pre-wrap;
  word-break: break-word;
}
.t-ok {
  color: var(--bx-mint);
}
.t-dim {
  color: var(--bx-text-3);
}

@media (max-width: 720px) {
  .hero__title {
    max-width: 100%;
  }
  .hero__terminal {
    margin-top: var(--bx-space-7);
  }
}
</style>
