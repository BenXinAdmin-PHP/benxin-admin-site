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
