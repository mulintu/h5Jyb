//记录白屏时间、首屏时间、首次可交互时间（页面加载完成后等8s左右再打开虚拟控制台看输出，否则时间不准确）
import { onLCP, onFID, onCLS, onFCP } from 'web-vitals'
import router from '@/router'
console.time('performance')
let skipStartTime = 0
let time = 0
router.beforeEach(() => {
	if (time) {
		skipStartTime = performance.now()
		console.log(skipStartTime, 'skipStartTime')
		time++
		getFMP()
	} else {
		time++
	}
})

// （First Input Delay）：首次输入延迟时间，用于记录用户首次与页面交互时响应的延迟，
// 即从用户首次与页面进行交互（即当他们单击链接、按钮、输入框等）到浏览器实际上能够响应该交互之间的时间，用于衡量页面交互性，谷歌要求页面的FID最好小于100毫秒；
onFID((metric) => {
	console.log('首次交互延迟FID：', metric.value)
})

onFCP((metric) => {
	console.log('白屏时间FCP：', metric.value)
})

getFMP()

//获取首屏时间
function getFMP() {
	const viewportWidth = window.innerWidth // 页面宽度
	const viewportHeight = window.innerHeight // 页面高度
	let observer = undefined // MutationObserver 监听的对象
	let entries = [] // observer 监听的元素变动集
	main()
	function main() {
		setTimeout(() => {
			observer && observer.disconnect()
			getRenderTime()

			// console.log(JSON.stringify(performance.getEntries()))
		}, 3000)

		observeFirstScreenPaint()
	}

	// MutationObserver 监听函数
	function observeFirstScreenPaint() {
		if (!MutationObserver) return

		const next = window.requestAnimationFrame || setTimeout

		// 不需要判断的 DOM
		const ignoreDOMList = ['STYLE', 'SCRIPT', 'LINK', 'META']

		observer = new MutationObserver((mutationList) => {
			const entry = {
				startTime: 0,
				children: [],
			}

			next(() => {
				entry.startTime = performance.now()
			})

			for (const mutation of mutationList) {
				if (mutation.addedNodes.length) {
					//有节点添加
					for (const node of Array.from(mutation.addedNodes)) {
						if (node.nodeType === 1 && !ignoreDOMList.includes(node.tagName) && !isInclude(node, entry.children)) {
							entry.children.push(node)
						}
					}
				}
			}

			if (entry.children.length) {
				entries.push(entry)
			}
		})

		observer.observe(document, {
			childList: true, // 监听 target 节点中发生的节点的新增与删除
			subtree: true, // 将会监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。默认值为 false
		})
	}

	function isInclude(node, arr) {
		if (!node || node === document.documentElement) {
			return false
		}

		if (arr.includes(node)) {
			return true
		}

		return isInclude(node.parentElement, arr)
	}

	// 获取 FMP
	function getRenderTime() {
		let startTime = 0
		entries.forEach((entry) => {
			for (const node of entry.children) {
				if (isInScreen(node) && entry.startTime > startTime && needToCalculate(node)) {
					startTime = entry.startTime
					break
				}
			}
		})

		// console.log('首屏定义为所有图片未加载完成 FMP:', startTime);
		console.log('startTime1：', startTime)
		// 加入图片时间做对比
		performance.getEntriesByType('resource').forEach((item) => {
			if (item.initiatorType === 'img') {
				console.log(JSON.stringify(item))
			}
			if (item.initiatorType === 'xmlhttprequest') {
				//接口
				console.log(JSON.stringify(item))
			}

			if (item.initiatorType === 'img' && item.fetchStart < startTime && item.responseEnd > startTime) {
				startTime = item.responseEnd
			}
		})

		console.log('startTime2：', startTime)
		console.timeEnd('performance')
		console.log('首屏完成时间FMP:', startTime - skipStartTime)

		return startTime
	}

	// 判断一个元素是否需要计算
	function needToCalculate(node) {
		// 隐藏的元素不用计算
		if (window.getComputedStyle(node).display === 'none') return false

		// 用于统计的图片不用计算
		if (node.tagName === 'IMG' && node.width < 2 && node.height < 2) {
			return false
		}

		return true
	}

	// dom 对象是否在屏幕内
	function isInScreen(dom) {
		const rectInfo = dom.getBoundingClientRect()
		if (rectInfo.left >= 0 && rectInfo.left < viewportWidth && rectInfo.top >= 0 && rectInfo.top < viewportHeight) {
			return true
		}
	}
}

//（Largest Contentful Paint）:最大内容绘制时间，用来衡量加载体验，谷歌要求LCP最好在页面首次开始加载后的2.5秒内发生，在用户第一次交互后停止记录
// onLCP((metric) => {
//   console.log('最大内容绘制完成时间LCP：', metric.value)
// });

// （Cumulative Layout Shift）：累积布局偏移，累计布局位移，用于衡量视觉稳定性，谷歌要求页面的CLS最好保持小于0.1。
// onCLS((metric) => {
//   console.log('累计布局位移CLS：', metric.value)
// });
