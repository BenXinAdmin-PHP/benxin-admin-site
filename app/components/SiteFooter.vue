<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   页脚（品牌 + slogan + 链接 GitHub/Gitee/文档/协议 + 语言切换）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  +----------------------------------------------------------------------
  文档链接本阶段指向 server 仓 README（独立文档站后续）。
-->
<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const links = [
  { key: 'github', href: GITHUB_URL },
  { key: 'gitee', href: GITEE_URL },
  { key: 'docs', href: DOCS_URL },
  { key: 'license', href: `${GITHUB_URL}/blob/main/LICENSE` },
]
</script>

<template>
  <footer class="ft">
    <div class="bx-container ft__inner">
      <div class="ft__brand">
        <NuxtLink :to="localePath('index')" class="ft__name">
          <span class="ft__mark">BX</span>
          BenXinAdmin
        </NuxtLink>
        <p class="ft__tagline bx-code">{{ t('footer.tagline') }}</p>
      </div>

      <nav class="ft__links" :aria-label="t('footer.docs')">
        <a
          v-for="l in links"
          :key="l.key"
          :href="l.href"
          target="_blank"
          rel="noopener"
          class="ft__link"
        >
          {{ t(`footer.${l.key}`) }}
        </a>
      </nav>

      <div class="ft__lang">
        <LangSwitch />
      </div>
    </div>

    <div class="bx-container ft__bottom">
      <span class="bx-code">{{ t('footer.copyright') }}</span>
    </div>
  </footer>
</template>

<style scoped>
.ft {
  position: relative;
  margin-top: var(--bx-space-8);
  border-top: 1px solid var(--bx-border);
  background: rgba(8, 12, 22, 0.5);
}
.ft__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px 32px;
  padding-block: 36px;
}
.ft__brand {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-right: auto;
}
.ft__name {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--bx-font-brand);
  font-weight: 700;
  font-size: 16px;
}
.ft__mark {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  background: var(--bx-grad);
}
.ft__tagline {
  font-size: 12px;
  color: var(--bx-text-3);
}
.ft__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
}
.ft__link {
  font-size: var(--bx-fs-sm);
  color: var(--bx-text-2);
  transition: color 0.25s var(--bx-ease);
}
.ft__link:hover {
  color: var(--bx-text);
}
.ft__bottom {
  padding-bottom: 28px;
  font-size: 12px;
  color: var(--bx-text-3);
}

@media (max-width: 640px) {
  .ft__brand {
    margin-right: 0;
    width: 100%;
  }
}
</style>
