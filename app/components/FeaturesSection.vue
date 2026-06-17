<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   首页区块 · 核心特性（6 卡片网格，块类型 = feature-grid）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  +----------------------------------------------------------------------
  图标为自绘 stroke SVG（零版权 §10）；卡片内容走 i18n features.items 数组。
-->
<script setup lang="ts">
const { t, tm, rt } = useI18n()

interface FeatureItem {
  title: string
  desc: string
}
const items = computed(() =>
  (tm('features.items') as unknown[]).map((it) => {
    const o = it as { title: unknown; desc: unknown }
    return { title: rt(o.title as string), desc: rt(o.desc as string) } as FeatureItem
  }),
)

// 自绘抽象图标（stroke），与 6 卡片一一对应
const icons: string[][] = [
  ['M9 8l-4 4 4 4', 'M15 8l4 4-4 4'],
  ['M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z', 'M9 11l2 2 4-4'],
  ['M7 10V8a5 5 0 0 1 10 0v2', 'M5 10h14v9H5z', 'M12 14v2'],
  [
    'M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z',
    'M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7',
    'M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  ],
  ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
  ['M7 3h10v18H7z', 'M10.5 18h3'],
]
</script>

<template>
  <section id="features" class="features bx-section">
    <div class="bx-container">
      <div class="bx-section__head bx-reveal" v-reveal>
        <h2 class="bx-section__title">{{ t('features.title') }}</h2>
      </div>

      <ul class="features__grid">
        <li
          v-for="(item, i) in items"
          :key="i"
          class="features__card bx-card bx-reveal"
          v-reveal="i * 70"
        >
          <span class="features__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                v-for="(d, k) in icons[i]"
                :key="k"
                :d="d"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <h3 class="features__title">{{ item.title }}</h3>
          <p class="features__desc">{{ item.desc }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.features__card {
  padding: 28px 24px;
}
.features__icon {
  display: inline-grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  color: var(--bx-brand);
  background: var(--bx-brand-soft);
  border: 1px solid var(--bx-border-brand);
}
.features__title {
  margin-top: 18px;
  font-family: var(--bx-font-brand);
  font-size: var(--bx-fs-xl);
  font-weight: 700;
  line-height: 1.3;
}
.features__desc {
  margin-top: 10px;
  font-size: var(--bx-fs-sm);
  line-height: 1.75;
  color: var(--bx-text-2);
}

@media (max-width: 920px) {
  .features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 560px) {
  .features__grid {
    grid-template-columns: 1fr;
  }
}
</style>
