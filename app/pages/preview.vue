<!--
  +----------------------------------------------------------------------
  | @project   BenXinAdmin
  | @mission   官网草稿预览路由 /preview（客户端渲染 + noindex + 跨源 postMessage 接收实时编辑态）
  | @author    仗键天涯(daxing)
  | @email     3442535897@qq.com
  | @date      2026-06-18
  | @updated   2026-06-20（B-增强-①补：收到 payload.lang 后运行时切 chrome locale，整页中英一致）
  | @updated   2026-06-21（①补-fix：useI18n 改取全局 scope，根治 chrome 文案不随 locale 重渲）
  +----------------------------------------------------------------------
  B2-①（ADR-25）：后台搭建器经 postMessage 把「当前编辑器 blocks（含未保存改动）+ lang」推入本页，
  复用 B1-② 的 resolveBlocksByLang + <PageRenderer> 渲染真实暗色科技风。零 server、零 token、零 api。
  安全关键：仅接受 event.origin === runtimeConfig.public.adminOrigin 的消息（精确相等），其余一律丢弃；
  发 'preview-ready' 握手用显式 targetOrigin（非 '*'）；渲染走 PageRenderer {{ }} 转义，无 v-html。
  noindex：useHead 注 noindex,nofollow（与官网「允许收录」相反）；不预渲染 / 不进 sitemap 见 nuxt.config routeRules。
  内容仅内存态、刷新即清；直开/超时/非法数据走友好态不崩。
-->
<script setup lang="ts">
import { resolveBlocksByLang } from '~/utils/resolveBlocks'
import type { ApiBlock } from '~/types/page'

// 必须取「全局」i18n 作用域（useScope:'global'）：裸 useI18n() 返回的是局部 composer，其 locale 仅从全局 root
// 单向同步、写它不回写全局，故 chrome 各组件（SiteHeader/SiteFooter/LangSwitch，均从全局 root 同步）不会重渲——
// 这是 ①补(03fba26) chrome 文案不随 lang 切的根因。改取全局 composer：写 locale.value 即改全局 root，所有
// 局部 composer 随之同步、t() 整页重渲；且仅切显示 locale、不经路由（区别于会导航的 setLocale），守「不换路由」。
const { t, locale } = useI18n({ useScope: 'global' })
const config = useRuntimeConfig()
// 可信发送方 origin 白名单（nuxt.config ADMIN_ORIGIN，dev 占位 http://localhost:5173）
const adminOrigin = config.public.adminOrigin as string

// 预览页绝不可被搜索引擎收录（与官网其它页「允许收录」相反）；nuxt.config routeRules 另注 X-Robots-Tag。
useHead({
  meta: [{ name: 'robots', content: 'noindex,nofollow' }],
})

type Lang = 'zh' | 'en'
// 页面状态：waiting 等待数据 / ready 已渲染 / invalid 数据非法 / direct 直开无 opener
type PreviewState = 'waiting' | 'ready' | 'invalid' | 'direct'

const state = ref<PreviewState>('waiting')
// 接收到的原始区块（{zh,en} 形态，未经 lang 解析——与后台编辑器内存形态一致）
const rawBlocks = ref<Array<Record<string, unknown>>>([])
const previewLang = ref<Lang>('zh')

// 按 payload.lang 解析为字符串形态（与已发布页完全同管线、同观感）
const resolvedBlocks = computed<ApiBlock[]>(
  () => resolveBlocksByLang(rawBlocks.value, previewLang.value) as ApiBlock[],
)
const previewLangName = computed(() => (previewLang.value === 'en' ? 'English' : '中文'))

/** payload 形状校验：type=preview-data + blocks 为数组 + lang∈{zh,en}。 */
function isValidPayload(data: unknown): data is { type: string; blocks: unknown[]; lang: Lang } {
  if (typeof data !== 'object' || data === null) return false
  const d = data as Record<string, unknown>
  return (
    d.type === 'preview-data' &&
    Array.isArray(d.blocks) &&
    (d.lang === 'zh' || d.lang === 'en')
  )
}

function onMessage(event: MessageEvent) {
  // —— 安全闸（首要校验）：仅接受可信后台 origin 的消息，精确相等（协议+host+port）；
  //    不命中直接丢弃，杜绝任意页面伪造预览内容。
  if (event.origin !== adminOrigin) return
  // 只关心 preview-data 类型；握手回声等其它类型忽略（不误判为非法）。
  if ((event.data as { type?: unknown } | null)?.type !== 'preview-data') return
  if (!isValidPayload(event.data)) {
    state.value = 'invalid'
    return
  }
  rawBlocks.value = event.data.blocks as Array<Record<string, unknown>>
  previewLang.value = event.data.lang
  // chrome 与内容区同源同值：同一 payload.lang 既驱动 blocks 解析，又切运行时 chrome locale，
  // 令菜单/语言切换/草稿横幅/footer 与内容区语言一致（不引入第二个语言状态）。直开/等待态不到此处，保持默认 locale。
  locale.value = event.data.lang
  state.value = 'ready'
}

let directTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  window.addEventListener('message', onMessage)
  if (window.opener) {
    // 就绪握手：向打开者（后台搭建器）声明可接收数据；targetOrigin 显式锁定，绝不用 '*'。
    window.opener.postMessage({ type: 'preview-ready' }, adminOrigin)
  } else {
    // 无 opener（浏览器直接访问）：短暂等待容纳测试场景后引导从后台打开，不崩。
    directTimer = setTimeout(() => {
      if (state.value === 'waiting') state.value = 'direct'
    }, 1500)
  }
})

onUnmounted(() => {
  window.removeEventListener('message', onMessage)
  if (directTimer) clearTimeout(directTimer)
})
</script>

<template>
  <div class="preview">
    <!-- 草稿预览横幅（暗色科技风，双语，ready 时显示当前预览语言） -->
    <div class="preview__banner" role="status" aria-live="polite">
      <span class="preview__badge">{{ t('preview.banner') }}</span>
      <span class="preview__hint">{{ t('preview.bannerHint') }}</span>
      <span v-if="state === 'ready'" class="preview__lang">
        {{ t('preview.langLabel') }}{{ previewLangName }}
      </span>
    </div>

    <!-- 内容由 postMessage 在 mount 后到达，仅客户端渲染 -->
    <ClientOnly>
      <!-- 渲染态：复用已发布页同管线（resolveBlocksByLang → PageRenderer，零改 PageRenderer） -->
      <PageRenderer v-if="state === 'ready'" :blocks="resolvedBlocks" />

      <!-- 友好态：等待 / 直开引导 / 数据非法，均暗色风不崩 -->
      <div v-else class="preview__placeholder">
        <div class="preview__card">
          <p class="preview__title">{{ t(`preview.${state}.title`) }}</p>
          <p class="preview__desc">{{ t(`preview.${state}.desc`) }}</p>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
/* 横幅：贴在站点导航之下（top=nav 高度），不与 sticky SiteHeader 重叠 */
.preview__banner {
  position: sticky;
  top: var(--bx-nav-h);
  z-index: 40;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bx-space-3);
  padding: var(--bx-space-2) var(--bx-space-4);
  background: var(--bx-surface-2);
  border-bottom: 1px solid var(--bx-border-brand);
  box-shadow: var(--bx-shadow-brand);
  backdrop-filter: blur(8px);
}

.preview__badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--bx-radius-pill);
  background: var(--bx-brand-soft);
  border: 1px solid var(--bx-border-brand);
  color: var(--bx-text);
  font-weight: 600;
  font-size: var(--bx-fs-sm);
  letter-spacing: 0.02em;
}

.preview__hint {
  color: var(--bx-text-3);
  font-size: var(--bx-fs-sm);
}

.preview__lang {
  margin-left: auto;
  color: var(--bx-text-2);
  font-size: var(--bx-fs-sm);
  font-family: var(--bx-font-mono);
}

.preview__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--bx-space-6) var(--bx-space-4);
}

.preview__card {
  max-width: 520px;
  text-align: center;
  padding: var(--bx-space-7) var(--bx-space-6);
  border-radius: var(--bx-radius-lg);
  background: var(--bx-surface);
  border: 1px solid var(--bx-border);
}

.preview__title {
  margin: 0 0 var(--bx-space-3);
  color: var(--bx-text);
  font-size: var(--bx-fs-lg);
  font-weight: 600;
}

.preview__desc {
  margin: 0;
  color: var(--bx-text-3);
  font-size: var(--bx-fs-base);
  line-height: 1.6;
}
</style>
