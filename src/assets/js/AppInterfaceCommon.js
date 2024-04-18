const u = navigator.userAgent
// const app = navigator.appVersion;
export const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // g
export const isIOS = !isAndroid
// import { uid } from "./msg.js";
import { useUsersStore } from '@/store/user'
const store = useUsersStore()
const AppInterfaceCommon = {
	closeWeb: () => {
		try {
			if (isIOS) {
				window.webkit.messageHandlers.tgClose.postMessage({})
			} else if (isAndroid) {
				window.jybapp.tgClose()
			}
		} catch (e) {
			// return 'closeWeb is not exist';
		}
	},
	shareTopic: (obj) => {
		// const obj_ = {
		//   title: a,
		//   desc: b,
		//   imgurl: c,
		//   openurl: d,
		//   name: e,
		// };
		try {
			if (isIOS) {
				window.webkit.messageHandlers.shareTopic.postMessage(obj)
			}
			if (isAndroid) {
				console.log(JSON.stringify(obj))
				// window.jybapp.shareTopic(JSON.stringify(data));
				window.jybapp.shareTopic(JSON.stringify(obj))
			}
		} catch (e) {
			// return 'shareTopic is not exist';
		}
	},
	needLogin: (gotoPage) => {
		try {
			const url =
				gotoPage !== undefined
					? {
							url: gotoPage,
					  }
					: {
							url: decodeURIComponent(window.location.href),
					  }
			if (isIOS) {
				window.webkit.messageHandlers.NeedLogin.postMessage(url)
			} else if (isAndroid) {
				// url.informSuccess = true
				window.jybapp.NeedLogin(JSON.stringify(url))
			}
		} catch (e) {
			// return 'NeedLogin is not exist';
			console.log('needLogin is not exist')
		}
	},
	openXiaoECourse: async (obj) => {
		/**
		 * 功能：配置小鹅通分享信息并跳转小鹅通课程
		 * @param {string}    description   // 课程备注
		 * @param {string}    duration      // 时长
		 * @param {string}    endTime       //直播结束时间
		 * @param {string}    startTime     //开始时间
		 * @param {string}    imageUrl      //封面链接
		 * @param {string}    title         //标题
		 * @param {string}    url           //目标地址
		 * @param {string}    source        //网址来源是否小鹅通,1-为第三方,0为小鹅通
		 * @param {string}    isLive        //是否直播，1为true，空或0为false
		 * @param {string}    imgBase64     // 封面的base64码
		 */

		if (!store.getUid) {
			AppInterfaceCommon.needLogin(location.href)
			return
		}

		await getImgBase64(obj.imageUrl)
			.then((res) => {
				console.log(res)
				if (res) {
					obj.imgBase64 = res
				}
			})
			.catch((err) => {
				obj.imgBase64 = ''
				obj.status = '封面加载失败'
				console.log(err, obj)
			})
		try {
			if (isIOS) {
				window.webkit.messageHandlers.openXiaoECourse.postMessage(obj)
			} else if (isAndroid) {
				window.jybapp.openXiaoECourse(JSON.stringify(obj))
			}
		} catch (e) {
			console.log(obj, 'openXiaoECourse is not exist')
		}
	},
	getShareInfo: (obj) => {
		//活動頁分享
		try {
			if (isIOS) {
				window.webkit.messageHandlers.PhillipShareInfo.postMessage(obj)
			} else if (isAndroid) {
				window.jybapp.getShareInfo(JSON.stringify(obj))
			}
		} catch (e) {
			console.log('getShareInfo is not exist', obj)
		}
	},
	tgShare: (obj) => {
		//活動頁分享
		try {
			if (isIOS) {
				window.webkit.messageHandlers.tgShare.postMessage(obj)
			} else if (isAndroid) {
				window.jybapp.tgShare(JSON.stringify(obj))
			}
		} catch (e) {
			console.log('tgShare is not exist', obj)
		}
	},
	openAdvertising: (data) => {
		//广告跳转
		try {
			if (isIOS) {
				window.webkit.messageHandlers.openAdvertising.postMessage(data)
			} else if (isAndroid) {
				window.jybapp.openAdvertising(JSON.stringify(data))
			}
		} catch (e) {
			console.log('openAdvertising', data)
			// return 'openAdvertising is not exist';
		}
	},
	PhillipDeal: (data) => {
		//交易登录页
		try {
			if (isIOS) {
				window.webkit.messageHandlers.PhillipDeal.postMessage(data)
			} else if (isAndroid) {
				window.jybapp.PhillipDeal(JSON.stringify(data))
			}
		} catch (e) {
			console.log('PhillipDeal is not exist', data)
		}
	},
	PhillipAccount: (data) => {
		//辉立开户

		try {
			if (isIOS) {
				window.webkit.messageHandlers.PhillipAccount.postMessage(data)
			} else if (isAndroid) {
				window.jybapp.PhillipAccount(JSON.stringify(data))
			}
		} catch (e) {
			console.log('PhillipAccount is not exist', data)
		}
	},
	jumpOtherWeb: (data) => {
		// App打开网页
		try {
			if (isIOS) window.webkit.messageHandlers.jumpOtherWeb.postMessage(data)
			else if (isAndroid) window.jybapp.jumpOtherWeb(JSON.stringify(data))
		} catch (e) {
			console.log('jumpOtherWeb is not exist', data)
		}
	},
	openWeb: (url) => {
		const data = {
			url,
		}
		try {
			if (isIOS) {
				window.webkit.messageHandlers.openWeb.postMessage(data)
			} else if (isAndroid) {
				window.jybapp.openWeb(JSON.stringify(data))
			}
		} catch (e) {
			console.log(url, 'openWeb is not exist')
		}
	},
	goToQuotation(data) {
		try {
			if (isIOS) {
				window.webkit.messageHandlers.goToQuotation.postMessage(data)
			} else if (isAndroid) {
				window.jybapp.goToQuotation(JSON.stringify(data))
			}
		} catch (e) {
			console.log('goToQuotation is not exist', data)
		}
	},
	tgStockDetail(data) {
		try {
			if (isIOS) {
				window.webkit.messageHandlers.tgStockDetail.postMessage(data)
			} else if (isAndroid) {
				window.jybapp.tgStockDetail(JSON.stringify(data))
			}
		} catch (e) {
			console.log('tgStockDetail is not exist', data)
		}
	},
	// goBackWeb: function () {
	//   try {
	//     if (isIOS) {
	//       window.webkit.messageHandlers.goBack.postMessage({});
	//     } else if (isAndroid) {
	//       console.log('android')
	//       window.jybapp.goBack();
	//     }
	//   } catch (e) {
	//     return "NeedLogin is not exist";
	//   }
	// }
}

async function getImgBase64(url) {
	if (url.includes('https') && (location.href.includes('uat') || location.href.includes('localhost') || location.href.includes('192.168')))
		url = `http${url.slice(5)}`
	return new Promise((resolve, reject) => {
		let image = new Image()
		image.setAttribute('crossOrigin', 'anonymous')
		let imageUrl = url
		image.src = imageUrl
		image.onerror = (res) => {
			reject(res)
		}
		image.onload = () => {
			let canvas = document.createElement('canvas')
			canvas.width = image.width
			canvas.height = image.height
			let context = canvas.getContext('2d')
			context.drawImage(image, 0, 0, image.width, image.height)
			let quality = 0.8
			// 这里的dataurl就是base64类型
			resolve(canvas.toDataURL('image/jpeg', quality))
		}
	})
}
export default AppInterfaceCommon
