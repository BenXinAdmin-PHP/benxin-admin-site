/*
 * +----------------------------------------------------------------------
 * | @project   BenXinAdmin
 * | @mission   页面区块共享类型（api / 渲染器 / 页面共用 ApiBlock）
 * | @author    仗键天涯(daxing)
 * | @email     3442535897@qq.com
 * | @date      2026-06-18
 * +----------------------------------------------------------------------
 * 说明（B1-②）：api renderBySlug / resolveBlocksByLang 产出的「已按 lang 解析为字符串」的区块。
 *   含 type 判别字段，其余字段按区块组件 props 形态动态取用（hero/prose/... 各异）。
 */

/** 已 lang 解析的区块（字符串形态），type 为白名单判别键。 */
export interface ApiBlock extends Record<string, unknown> {
  type: string
}

/**
 * 公开渲染接口返回的页面级 SEO（C2 ADR-26，③-①/③-①补）。
 * server 已按 lang 解析：seo_title/seo_description 为字符串（空回退 zh）；og_image 单值 URL（非 i18n）。
 * 页无 seo → 接口返 seo:null（site 走回退链：hero 派生 / 站点级文案 / 默认 og 图）。
 */
export interface ApiPageSeo {
  seo_title?: string | null
  seo_description?: string | null
  og_image?: string | null
}
