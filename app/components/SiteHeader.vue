<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   顶栏（品牌文字 logo + 锚点导航 + 语言切换 + GitHub，移动端汉堡菜单）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-17
  +----------------------------------------------------------------------
-->
<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const open = ref(false)
const scrolled = ref(false)

const onScroll = () => {
  scrolled.value = window.scrollY > 8
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// 锚点跳转回到本语言首页对应锚点
const anchorHref = (hash: string) => `${localePath('index')}${hash}`.replace('//', '/')
const closeMenu = () => (open.value = false)
</script>

<template>
  <header class="hdr" :class="{ 'is-scrolled': scrolled }">
    <div class="bx-container hdr__inner">
      <NuxtLink :to="localePath('index')" class="hdr__brand" @click="closeMenu">
        <span class="hdr__mark">BX</span>
        <span class="hdr__name">BenXinAdmin</span>
      </NuxtLink>

      <button
        class="hdr__burger"
        :aria-expanded="open"
        :aria-label="t('common.menu')"
        @click="open = !open"
      >
        <span /><span /><span />
      </button>

      <nav class="hdr__nav" :class="{ 'is-open': open }" :aria-label="t('common.menu')">
        <a
          v-for="item in NAV_ANCHORS"
          :key="item.key"
          :href="anchorHref(item.hash)"
          class="hdr__link"
          @click="closeMenu"
        >
          {{ t(`nav.${item.key}`) }}
        </a>
        <a
          :href="GITHUB_URL"
          class="hdr__link hdr__link--ext"
          target="_blank"
          rel="noopener"
          @click="closeMenu"
        >
          {{ t('nav.github') }}
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              fill="currentColor"
              d="M14 5h5v5h-2V8.41l-7.3 7.3-1.4-1.42L14.58 7H14V5zM5 7h4V5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4h-2v4H5V7z"
            />
          </svg>
        </a>
        <div class="hdr__lang">
          <LangSwitch />
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: sticky;
  top: 0;
  z-index: 50;
  transition: background 0.3s var(--bx-ease), border-color 0.3s var(--bx-ease);
  border-bottom: 1px solid transparent;
}
.hdr.is-scrolled {
  background: rgba(10, 14, 26, 0.72);
  backdrop-filter: blur(14px) saturate(150%);
  -webkit-backdrop-filter: blur(14px) saturate(150%);
  border-bottom-color: var(--bx-border);
}
.hdr__inner {
  height: var(--bx-nav-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.hdr__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}
.hdr__mark {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  background: var(--bx-grad);
  box-shadow: var(--bx-shadow-brand);
}
.hdr__name {
  font-family: var(--bx-font-brand);
  font-size: 17px;
  letter-spacing: -0.01em;
}
.hdr__nav {
  display: flex;
  align-items: center;
  gap: 6px;
}
.hdr__link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  font-size: var(--bx-fs-sm);
  color: var(--bx-text-2);
  border-radius: var(--bx-radius-pill);
  transition: color 0.25s var(--bx-ease), background 0.25s var(--bx-ease);
}
.hdr__link:hover {
  color: var(--bx-text);
  background: var(--bx-surface);
}
.hdr__lang {
  margin-left: 8px;
}
.hdr__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  width: 42px;
  height: 38px;
  align-items: center;
  justify-content: center;
  background: var(--bx-surface);
  border: 1px solid var(--bx-border);
  border-radius: var(--bx-radius-sm);
}
.hdr__burger span {
  display: block;
  width: 18px;
  height: 2px;
  background: var(--bx-text);
  border-radius: 2px;
}

@media (max-width: 860px) {
  .hdr__burger {
    display: flex;
  }
  .hdr__nav {
    position: absolute;
    top: var(--bx-nav-h);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 14px 24px 20px;
    background: rgba(10, 14, 26, 0.96);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--bx-border);
    transform: translateY(-12px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s var(--bx-ease), transform 0.25s var(--bx-ease);
  }
  .hdr__nav.is-open {
    transform: none;
    opacity: 1;
    pointer-events: auto;
  }
  .hdr__link {
    font-size: var(--bx-fs-base);
    padding: 12px 14px;
  }
  .hdr__lang {
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>
