<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   首页区块 · 开源/快速开始 CTA（块类型 = cta + code-block）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  | @updated   2026-06-17 17:35:00
  +----------------------------------------------------------------------
  块类型 = cta。标题/正文/按钮/命令由 i18n key 改为 api/兜底 props.block；
  代码块小标题（quickstartCaption 非 schema 字段）为前端装饰，仍走 chrome i18n。
-->
<script setup lang="ts">
const { t } = useI18n()
const props = defineProps<{ block: Record<string, any> }>()

interface CtaButton {
  text: string
  href?: string
  variant?: string
}
const buttons = computed(() => (props.block.buttons ?? []) as CtaButton[])

// quickstart 为 \n 连接的命令串，按行拆分等宽展示
const quickstart = computed(() =>
  String(props.block.quickstart ?? '')
    .split('\n')
    .filter((l) => l.trim() !== ''),
)

const isExternal = (href?: string) => !!href && /^https?:\/\//.test(href)
const btnClass = (variant?: string) =>
  variant === 'primary' ? 'bx-btn bx-btn--primary' : 'bx-btn bx-btn--ghost'
</script>

<template>
  <section id="get-started" class="cta bx-section">
    <AuroraBg />
    <div class="bx-container cta__inner">
      <div class="cta__copy bx-reveal" v-reveal>
        <h2 class="cta__title bx-grad-text">{{ block.title }}</h2>
        <p class="cta__body">{{ block.body }}</p>
        <div class="cta__actions">
          <a
            v-for="(btn, i) in buttons"
            :key="i"
            :href="btn.href || '#'"
            :target="isExternal(btn.href) ? '_blank' : undefined"
            :rel="isExternal(btn.href) ? 'noopener' : undefined"
            :class="btnClass(btn.variant)"
          >
            {{ btn.text }}
          </a>
        </div>
      </div>

      <div class="cta__code bx-reveal" v-reveal="140">
        <div class="cta__codebar">
          <span class="bx-code">{{ t('common.quickstartCaption') }}</span>
        </div>
        <pre class="cta__pre bx-code"><code v-for="(line, i) in quickstart" :key="i" class="cta__line"><span class="cta__prompt">$</span> {{ line }}</code></pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  position: relative;
  overflow: hidden;
}
.cta__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}
.cta__title {
  font-family: var(--bx-font-brand);
  font-size: var(--bx-fs-section);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.01em;
}
.cta__body {
  margin-top: var(--bx-space-4);
  font-size: var(--bx-fs-lg);
  color: var(--bx-text-2);
  max-width: 48ch;
}
.cta__actions {
  margin-top: var(--bx-space-6);
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}
.cta__code {
  border: 1px solid var(--bx-border);
  border-radius: var(--bx-radius);
  background: rgba(8, 12, 22, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: var(--bx-shadow);
  overflow: hidden;
}
.cta__codebar {
  padding: 11px 16px;
  border-bottom: 1px solid var(--bx-border);
  background: var(--bx-surface);
  color: var(--bx-text-3);
  font-size: 12px;
}
.cta__pre {
  margin: 0;
  padding: 16px 18px;
  font-size: 13px;
  line-height: 1.95;
  overflow-x: auto;
}
.cta__line {
  display: block;
  white-space: pre;
  color: var(--bx-text);
}
.cta__prompt {
  color: var(--bx-mint);
  margin-right: 8px;
}

@media (max-width: 860px) {
  .cta__inner {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
</style>
