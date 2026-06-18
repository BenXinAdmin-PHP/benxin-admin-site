// +----------------------------------------------------------------------
// | @project   BenXinAdmin
// | @mission   动态 sitemap 源 — GET /__sitemap__/pages（build 期拉已发布页清单产双语条目）
// | @author    仗键天涯(daxing)
// | @email     3442535897@qq.com
// | @date      2026-06-18
// +----------------------------------------------------------------------
// B1-②（ADR-24）：@nuxtjs/sitemap 的 sources 源。拉 B1-① GET /api/v1/pages，对每个已发布页（≠home）
// 产一条 loc=/<slug> 并以 _i18nTransform 让模块按 i18n 自动展开中/英两 URL + hreflang 互链。
// lastmod 由本仓把 B1-① 透传的 DB 时间（'YYYY-MM-DD HH:mm:ss'）格式化为 ISO-8601（假设 UTC，统一即可）。
// 兜底：拉取失败/超时 → 返回 []，sitemap 退化为仅既有静态条目（home），不报错、不阻断构建（守 §1）。

interface PageListItem {
  slug?: string
  updated_at?: string
}
interface PagesResponse {
  code?: number
  data?: PageListItem[]
}

/** DB datetime（无时区）→ ISO-8601；不可解析则返回 undefined（该条不带 lastmod）。 */
function toIso(raw?: string): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') return undefined
  const d = new Date(raw.replace(' ', 'T') + 'Z')
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

export default defineSitemapEventHandler(async (event) => {
  const apiBase = useRuntimeConfig(event).public.apiBase as string
  try {
    const res = await $fetch<PagesResponse>(`${apiBase}/api/v1/pages`, {
      timeout: 5000,
      retry: 0,
    })
    const list = Array.isArray(res?.data) ? res.data : []
    return list
      .filter((p) => typeof p?.slug === 'string' && p.slug !== '' && p.slug !== 'home')
      .map((p) => ({
        loc: `/${p.slug}`,
        lastmod: toIso(p.updated_at),
        _i18nTransform: true,
      }))
  } catch (err) {
    console.warn('[sitemap] 拉已发布页清单失败，退化为静态条目：', (err as Error)?.message)
    return []
  }
})
