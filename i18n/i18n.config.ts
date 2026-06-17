/*
 * +----------------------------------------------------------------------
 * | @project   BenXinAdmin
 * | @mission   vue-i18n 运行时配置（缺译兜底回退中文）
 * | @author    仗键天涯(daxing)
 * | @email     3442535897@qq.com
 * | @date      2026-06-17
 * +----------------------------------------------------------------------
 */
export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'zh',
}))
