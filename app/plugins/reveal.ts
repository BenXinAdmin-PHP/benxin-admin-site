/*
 * +----------------------------------------------------------------------
 * | @project   BenXinAdmin
 * | @mission   scroll-reveal 指令 v-reveal（进入视口淡入上移，尊重 reduced-motion）
 * | @author    仗键天涯(daxing)
 * | @email     3442535897@qq.com
 * | @date      2026-06-17
 * +----------------------------------------------------------------------
 * 用法：<div v-reveal class="bx-reveal">；元素进视口加 is-visible 触发过渡。
 *  通用插件：SSR 端提供 getSSRProps 占位，mounted（含 IntersectionObserver）仅客户端执行。
 *  prefers-reduced-motion 或不支持 IntersectionObserver 时直接显示。
 */
export default defineNuxtPlugin((nuxtApp) => {
  const reveal = (el: HTMLElement) => el.classList.add('is-visible')

  nuxtApp.vueApp.directive('reveal', {
    // SSR 渲染期返回空 props，避免 ssrGetDirectiveProps 读取 undefined
    getSSRProps() {
      return {}
    },
    mounted(el: HTMLElement, binding) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce || typeof IntersectionObserver === 'undefined') {
        reveal(el)
        return
      }
      // 支持 v-reveal="120" 设置延迟（ms），做错落淡入
      const delay = Number(binding.value) || 0
      if (delay) el.style.transitionDelay = `${delay}ms`

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(el)
              io.unobserve(el)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
      io.observe(el)
    },
  })
})
