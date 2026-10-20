/*
 * +----------------------------------------------------------------------
 * | @project   BenXinAdmin
 * | @mission   官网页面按钮链接协议白名单
 * | @author    仗键天涯(daxing)
 * | @email     3442535897@qq.com
 * | @date      2026-10-20 18:42:23
 * +----------------------------------------------------------------------
 */

/** 对已发布页和未落库的预览内容统一阻止脚本协议。 */
export function safeHref(value: unknown): string {
  if (typeof value !== 'string') return '#'
  const href = value.trim()
  if (!href || /[\\\s\u0000-\u001f\u007f]/.test(href)) return '#'
  if (href.startsWith('#') || (href.startsWith('/') && !href.startsWith('//'))) return href
  try {
    const url = new URL(href)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname ? href : '#'
  } catch {
    return '#'
  }
}
