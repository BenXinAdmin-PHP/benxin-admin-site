<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   首页区块 · 截图墙 Showcase（本阶段自绘 CSS/SVG 占位，块类型 = showcase）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  | @updated   2026-06-17 17:35:00
  +----------------------------------------------------------------------
  块类型 = showcase。标题/字幕由 i18n key 改为 api/兜底 props.block.items（{caption,image}）。
  占位块为自绘抽象界面（品牌渐变 + 几何，零版权 §10）；真实截图 daxing 后补。
-->
<script setup lang="ts">
const props = defineProps<{ block: Record<string, any> }>()

const captions = computed(() =>
  ((props.block.items ?? []) as { caption: string }[]).map((s) => s.caption),
)

// 占位说明（装饰性，非可翻译卖点；真实截图后补）
const placeholderNote = '— preview placeholders, real screenshots coming soon —'
</script>

<template>
  <section id="showcase" class="show bx-section">
    <div class="bx-container">
      <div class="bx-section__head bx-reveal" v-reveal>
        <h2 class="bx-section__title">{{ block.title }}</h2>
      </div>

      <ul class="show__grid">
        <li
          v-for="(cap, i) in captions"
          :key="i"
          class="show__card bx-card bx-reveal"
          v-reveal="i * 80"
        >
          <!-- 自绘抽象界面占位（按 variant 切换布局） -->
          <div class="show__art" :data-variant="i" aria-hidden="true">
            <div class="show__bar">
              <span /><span /><span />
            </div>
            <div class="show__body" :data-variant="i">
              <template v-if="i === 0">
                <span class="show__side" />
                <div class="show__main">
                  <span class="show__row w70" />
                  <span class="show__row w90" />
                  <span class="show__row w55" />
                  <span class="show__row w80" />
                </div>
              </template>
              <template v-else-if="i === 1">
                <span class="show__tile lg" />
                <span class="show__tile" />
                <span class="show__tile" />
                <span class="show__tile wide" />
                <span class="show__tile" />
              </template>
              <template v-else>
                <div class="show__phone">
                  <span class="show__hero" />
                  <span class="show__chip2" />
                  <span class="show__chip2" />
                  <span class="show__row w90" />
                  <span class="show__row w70" />
                </div>
              </template>
            </div>
          </div>
          <p class="show__caption">{{ cap }}</p>
        </li>
      </ul>

      <p class="show__note bx-code">{{ placeholderNote }}</p>
    </div>
  </section>
</template>

<style scoped>
.show__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.show__card {
  padding: 16px;
}
.show__art {
  border-radius: var(--bx-radius);
  overflow: hidden;
  border: 1px solid var(--bx-border);
  background: linear-gradient(160deg, rgba(43, 111, 255, 0.16), rgba(124, 92, 255, 0.1));
  aspect-ratio: 4 / 3;
  display: flex;
  flex-direction: column;
}
.show__bar {
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  background: rgba(8, 12, 22, 0.45);
  border-bottom: 1px solid var(--bx-border);
}
.show__bar span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--bx-border-strong);
}
.show__body {
  flex: 1;
  padding: 14px;
  display: flex;
  gap: 10px;
}
/* variant 0：列表（侧栏 + 行） */
.show__side {
  width: 30%;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
}
.show__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.show__row {
  height: 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.09);
}
.w55 { width: 55%; }
.w70 { width: 70%; }
.w80 { width: 80%; }
.w90 { width: 90%; }

/* variant 1：Bento 卡片网格 */
.show__body[data-variant='1'] {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 8px;
}
.show__tile {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
}
.show__tile.lg {
  grid-row: span 2;
  background: linear-gradient(150deg, rgba(43, 111, 255, 0.4), rgba(25, 198, 230, 0.25));
}
.show__tile.wide {
  grid-column: span 2;
}

/* variant 2：C 端小程序 */
.show__body[data-variant='2'] {
  justify-content: center;
}
.show__phone {
  width: 62%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border-radius: 12px;
  background: rgba(8, 12, 22, 0.4);
  border: 1px solid var(--bx-border);
}
.show__hero {
  height: 38px;
  border-radius: 8px;
  background: var(--bx-grad);
}
.show__chip2 {
  height: 14px;
  width: 46%;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
}

.show__caption {
  margin-top: 14px;
  font-size: var(--bx-fs-sm);
  font-weight: 600;
  color: var(--bx-text-2);
  text-align: center;
}
.show__note {
  margin-top: 22px;
  text-align: center;
  font-size: 12px;
  color: var(--bx-text-3);
}

@media (max-width: 860px) {
  .show__grid {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin-inline: auto;
  }
}
</style>
