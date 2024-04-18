/**
 * @method getCache   取缓存数据data
 * {
 *  cacheKey : [
 *    {key:elementkey, data:数据, time:时间},
 *    {key:elementkey, data:数据, time:时间},
 *  ]
 * }
 * @param {String} projectName 项目名 newh5
 * @param {String} routerName 当前页面路由 home
 * @param {String} sign key标志 同一个页面要分别存储多类数据时使用
 * @param {String} elementkey   缓存数据的键名key (newelement的key)
 *
 * @return {string} 缓存的数据data
 *
 */
// projectName, routerName, newelement, sign = '', maxsize = 10
export function getCache(projectName, routerName, elementkey, sign = '') {
	let element = null
	const cachekey = `${projectName}_${routerName}_${sign}`
	// 根据名字获取数据
	try {
		const cacheData = JSON.parse(localStorage.getItem(cachekey) || 'null')
		// 是否为数组，放回对应key数据
		if (Array.isArray(cacheData) && cacheData.length > 0) {
			const data = cacheData.find((ele) => ele.key === elementkey)
			element = (data && data.data) || null
		}
	} catch (err) {
		console.log(err)
	}

	return element
}

/**
 * @method setCache   将数据缓存至LocalStorage
 * @param {String} projectName 项目名 newh5
 * @param {String} routerName 当前页面路由 home
 * @param {String} sign key标志 同一个页面要分别存储多类数据时使用
 * @param {Object} newelement  缓存数据集  { key:key, data:data}
 *               newelement.key  缓存对象的键名，同一缓存组，key可以赋值为股票代码、用户帐号、用户id等变量匹配数据
 *               newelement.data  缓存数据对象
 *               newelement.time  缓存时间，毫秒数
 * @param {Number} maxsize  缓存的最大数量，默认为10
 * @return {Boolean|Array} 缓存失败结果或所缓存的全部数据
 */
export function setCache(projectName, routerName, newelement, sign = '', maxsize = 10) {
	//localStorage键名：projectName_routerName_sign
	//localStorage键值：[newelement, newelement, { key:key, data:data}, newelement...]
	const cachekey = `${projectName}_${routerName}_${sign}`
	if (!cachekey || !cachekey.length || !newelement.key) {
		return false
	}
	let cacheData
	try {
		cacheData = JSON.parse(localStorage.getItem(cachekey) || 'null')
		newelement.time = new Date().getTime()
		if (cacheData) {
			const length = cacheData.length
			if (length) {
				cacheData.forEach((ele, i) => {
					if (ele.key === newelement.key) {
						//如果已经存在数据集，则删除此条数据集
						cacheData.splice(i, 1)
					}
				})
				// 把数据集加到数组第一条
				cacheData.unshift(newelement)
				// 缓存数据的数量限制
				if (cacheData.length > maxsize) cacheData = cacheData.slice(0, maxsize)
			} else {
				cacheData = [newelement]
			}
		} else {
			cacheData = [newelement]
		}

		localStorage.setItem(cachekey, JSON.stringify(cacheData))
	} catch (err) {
		//空间不足 支持出错 等 清楚部分缓存
		// for (let iKey in localStorage) {
		// 	if (iKey.includes(projectName)) {
		// 		localStorage.removeItem(iKey)
		// 	}
		// }
		deleteHalfCache()
		console.log(err)
	}
	return cacheData
}

/**
 * @method removeCache   删除特定缓存数据
 * @param {String} projectName 项目名 newh5
 * @param {String} routerName 当前页面路由 home
 * @param {String} sign key标志 同一个页面要分别存储多类数据时使用
 * @param {String|Array} elementkey   缓存数据的键名key
 */
export function removeCache(projectName, routerName, elementkey, sign = '') {
	//localStorage键名：projectName_routerName_sign
	//localStorage键值：[newelement, newelement, { key:key, data:data}, newelement...]
	const cachekey = `${projectName}_${routerName}_${sign}`

	if (!cachekey || !cachekey.length || !elementkey) {
		return false
	}
	const cacheData = JSON.parse(localStorage.getItem(cachekey) || 'null')
	function clear(name) {
		cacheData.forEach((ele, i) => {
			if (ele.key === name) {
				cacheData.splice(i, 1)
			}
		})
	}

	if (cacheData) {
		const length = cacheData.length
		if (length) {
			if (Array.isArray(elementkey)) {
				elementkey.forEach((name) => {
					clear(name)
				})
			} else {
				clear(elementkey)
			}
		}
		localStorage.setItem(cachekey, JSON.stringify(cacheData))
	}
}

//按存储时间清除一半缓存
function deleteHalfCache() {
	const cacheItems = []
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i)
		const value = JSON.parse(localStorage.getItem(key))
		if (Array.isArray(value) && value[0] && value[0].time) {
			const cacheItem = { key: key, value: value }
			cacheItems.push(cacheItem)
		}
	}

	cacheItems.sort(function (a, b) {
		return a.value[0].time - b.value[0].time
	})

	const numItemsToKeep = Math.floor(cacheItems.length * 0.5) // 保留一半的缓存项
	for (let i = 0; i < cacheItems.length - numItemsToKeep; i++) {
		const key = cacheItems[i].key
		localStorage.removeItem(key)
	}
}
