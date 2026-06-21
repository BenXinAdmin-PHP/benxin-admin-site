/*
 * +----------------------------------------------------------------------
 * | @project   BenXinAdmin
 * | @mission   页面 SEO head 共享工具（seo 字段提取 + og:image 绝对化，C2 ③-②）
 * | @author    仗键天涯(daxing)
 * | @email     3442535897@qq.com
 * | @date      2026-06-21
 * +----------------------------------------------------------------------
 * 说明（C2 ADR-26，③-②）：[slug].vue / index.vue 的 head 计算共享此处，避免两处回退逻辑漂移。
 *   title/description 的回退「源」两页不同（home 走站点级 i18n、[slug] 走 hero 派生），故不强抽；
 *   真正共享且易漂移的是「seo 字符串安全提取」与「og:image 绝对化」——抽于此。
 */
import type { ApiPageSeo } from '~/types/page'

/** 安全提取 seo 字符串字段：非字符串/空白 → ''（供 `seoVal || fallback` 回退链直接用）。 */
export function pickSeoString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

/**
 * og:image 绝对化（社交分享卡片要求绝对 URL）：
 * - seo.og_image 为 http(s) 绝对址 → 原样用；
 * - 为相对路径（部署者填素材库相对地址）→ 用 siteUrl 拼绝对；
 * - 空/缺省 → 站点默认图 `${siteUrl}/og/og-default.png`（B1-② 既有资产，§10 无新增）。
 */
export function resolveOgImage(ogImage: unknown, siteUrl: string): string {
  const base = String(siteUrl).replace(/\/+$/, '')
  const raw = pickSeoString(ogImage)
  if (raw) {
    return /^https?:\/\//i.test(raw) ? raw : `${base}/${raw.replace(/^\/+/, '')}`
  }
  return `${base}/og/og-default.png`
}

/** seo 对象按需取（null 安全）：返回 {title, description, ogImageRaw} 三字符串（未回退、未绝对化）。 */
export function seoFields(seo: ApiPageSeo | null | undefined): {
  title: string
  description: string
  ogImageRaw: string
} {
  return {
    title: pickSeoString(seo?.seo_title),
    description: pickSeoString(seo?.seo_description),
    ogImageRaw: pickSeoString(seo?.og_image),
  }
}
