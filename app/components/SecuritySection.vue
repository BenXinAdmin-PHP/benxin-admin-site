<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   首页区块 · 安全 Security（标题 + 正文 + chips，块类型 = prose + chips）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  | @updated   2026-06-17 17:35:00
  +----------------------------------------------------------------------
  块类型 = security。标题/正文/chips 由 i18n key 改为 api/兜底 props.block。
-->
<script setup lang="ts">
const props = defineProps<{ block: Record<string, any> }>()

const chips = computed(() => (props.block.chips ?? []) as string[])
</script>

<template>
  <section id="security" class="sec bx-section">
    <div class="bx-container sec__grid">
      <div class="sec__intro bx-reveal" v-reveal>
        <h2 class="bx-section__title">{{ block.title }}</h2>
        <p class="sec__body">{{ block.body }}</p>
      </div>

      <ul class="sec__chips bx-reveal" v-reveal="120">
        <li v-for="(chip, i) in chips" :key="i" class="bx-chip">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" class="sec__tick">
            <path
              d="M5 12.5l4 4 10-10"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ chip }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.sec__grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 48px;
  align-items: start;
}
.sec__body {
  margin-top: var(--bx-space-5);
  font-size: var(--bx-fs-base);
  line-height: 1.8;
  color: var(--bx-text-2);
}
.sec__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.sec__chips .bx-chip {
  padding: 10px 16px;
  font-size: var(--bx-fs-sm);
}
.sec__tick {
  color: var(--bx-mint);
}

@media (max-width: 860px) {
  .sec__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
</style>
