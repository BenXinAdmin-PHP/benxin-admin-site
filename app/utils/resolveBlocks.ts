/*
 * +----------------------------------------------------------------------
 * | @project   BenXinAdmin
 * | @mission   兜底区块按 lang 解析工具（镜像后端 PageService::renderBySlug 解析）
 * | @author    仗键天涯(daxing)
 * | @email     3442535897@qq.com
 * | @date      2026-06-17 17:35:00
 * +----------------------------------------------------------------------
 * 说明（ADR-23）：
 *   - api 渲染接口已按 lang 把 i18n 字段解析为字符串；本工具仅用于「api 不可达」时把
 *     内置兜底 defaultHome（{zh,en} 原始形态）解析为与 api 一致的字符串形态。
 *   - 解析规则镜像后端 pickLang：取 field[lang]，为空则回退 field.zh（再空则空串）。
 *   - 形状检测而非 schema 驱动：兜底数据形态由前端自控、不引后端 BLOCK_SCHEMA，
 *     i18n 节点以「含 zh/en 键的非数组对象」识别（足以覆盖本站兜底内容）。
 *   - 已是字符串形态的数据（如 api blocks）经此函数为无副作用透传，可安全复用。
 */

type Lang = 'zh' | 'en'

/** 是否为 i18n 文本节点：含 zh/en 键的普通对象（非数组）。 */
function isI18nNode(v: unknown): v is Record<string, unknown> {
  return (
    typeof v === 'object' &&
    v !== null &&
    !Array.isArray(v) &&
    ('zh' in (v as object) || 'en' in (v as object))
  )
}

/** 取 i18n 节点指定语言文案，空回退 zh（镜像后端 pickLang）。 */
function pickLang(node: Record<string, unknown>, lang: Lang): string {
  const v = node[lang]
  if (typeof v === 'string' && v.trim() !== '') {
    return v
  }
  const zh = node.zh
  return typeof zh === 'string' ? zh : ''
}

/** 递归解析任意值：i18n → 字符串，数组 → 逐元素解析，对象 → 逐字段解析，标量原样。 */
function resolveValue(value: unknown, lang: Lang): unknown {
  if (Array.isArray(value)) {
    return value.map((el) => resolveValue(el, lang))
  }
  if (isI18nNode(value)) {
    return pickLang(value, lang)
  }
  if (typeof value === 'object' && value !== null) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = resolveValue(v, lang)
    }
    return out
  }
  return value
}

/**
 * 把兜底区块数组按 lang 解析为字符串形态（与 api 返回结构一致）。
 *
 * @param blocks 原始区块数组（{zh,en} 形态）
 * @param lang   目标语言，非 zh/en 归一为 zh
 */
export function resolveBlocksByLang(
  blocks: Array<Record<string, unknown>>,
  lang: string,
): Array<Record<string, unknown>> {
  const safeLang: Lang = lang === 'en' ? 'en' : 'zh'
  return blocks.map((b) => resolveValue(b, safeLang) as Record<string, unknown>)
}
