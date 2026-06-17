/*
 * +----------------------------------------------------------------------
 * | @project   BenXinAdmin
 * | @mission   官网外链常量（主仓 GitHub/Gitee、文档入口）
 * | @author    仗键天涯(daxing)
 * | @email     3442535897@qq.com
 * | @date      2026-06-17
 * +----------------------------------------------------------------------
 * 说明：注意仓库名两端不一致——GitHub 用 benxin、Gitee 用 binxin（§13.2），
 *  仅 git remote/外链地址按实际，文案一律 BenXinAdmin。
 */
export const GITHUB_URL = 'https://github.com/BenXinAdmin-PHP/benxin-admin-server'
export const GITEE_URL = 'https://gitee.com/binxin-admin/binxin-admin-server'
export const DOCS_URL =
  'https://github.com/BenXinAdmin-PHP/benxin-admin-server#readme'

// 首页锚点导航
export const NAV_ANCHORS = [
  { key: 'features', hash: '#features' },
  { key: 'moat', hash: '#moat' },
  { key: 'security', hash: '#security' },
  { key: 'stack', hash: '#stack' },
] as const
