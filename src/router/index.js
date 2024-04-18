import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/language/index'
const router = createRouter({
	history: createWebHistory('newh5'),
	routes: [
		{
			path: '/',
			redirect: '/home',
		},
		{
			path: '/home',
			name: 'home',
			component: () => import('@/views/home/index.vue'),
			meta: {
				title: 'home',
			},
		},
		// {
		//   path: '/error',
		//   redirect: '/',
		// },
		// {
		//   path: '/*',
		//   redirect: '/',
		// },
	],
})
router.beforeEach((to, from, next) => {
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
		document.title = i18n.global.t(to.meta.title) //解决网页头部简繁体问题
	}
	// const u = navigator.userAgent
	// const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
	// if (to.name === 'index' && from.name === 'index' && isIOS) {
	// 登录埋点
	// location.reload() //解决ios原生登录后不自动刷新
	// }
	next()
})
router.afterEach((to, from) => {
	// console.log('afterEach')
})

export default router
