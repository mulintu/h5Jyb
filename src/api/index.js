import service from './fetch'
import config from './config'
import jwt from './jwt'
import { type, source } from '@js/msg'
import { useUsersStore } from '@/store/user'
// const store = useUsersStore();

const { api, iqdii, liveapi } = config
export const JWT = () => {
	const store = useUsersStore()
	return service({
		url: `${api}/token?uid=${store.getUid}&sessionId=${store.getSession}`,
		method: 'get',
	})
}

export const queryArea = (data) => {
	//获取用户ip：Other&CN
	return service({
		url: `${liveapi}/popularity/account/queryArea`,
		method: 'get',
	})
}

var channel = ''
var browser = {
	versions: (function () {
		var u = navigator.userAgent,
			app = navigator.appVersion
		return {
			//移动终端浏览器版本信息
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
		}
	})(),
	language: (navigator.browserLanguage || navigator.language).toLowerCase(),
}
if (type) {
	if (source && source === 'fb') {
		channel = 'facebook'
	} else if (browser.versions.mobile) {
		//判断是否是移动设备打开。browser代码在上面
		var ua = navigator.userAgent.toLowerCase() //获取判断用的对象
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			//在微信中打开
			console.log('微信')
			channel = '微信'
		} else if (ua.match(/WeiBo/i) == 'weibo') {
			//在新浪微博客户端打开
			console.log('新浪微博')
			channel = '微博'
		} else if (ua.match(/QQ/i) == 'qq') {
			//在QQ空间打开
			console.log('qq')
			channel = 'qq'
		} else {
			channel = '其他'
		}
	} else {
		channel = 'pc'
	}
} else {
	channel = 'app内'
}
// console.log(channel);
export const getPoints = (data) => {
	//页面埋点
	data.channel = channel
	return service({
		url: `${api}/guess/lottery/getPoints`,
		method: 'post',
		data,
	})
}
export const GetUserRegisterDate = (data) => {
	//根据注册时间判断是否新用户
	const store = useUsersStore()
	return service({
		url: `${iqdii}/jybapp/Activity/GetUserRegisterDate`,
		method: 'post',
		data: { uid: store.getUid },
	})
}
