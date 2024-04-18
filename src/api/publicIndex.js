import service from './fetch'
import config from './config'
import jwt from './jwt'
import { uid, session } from '@js/msg'

const { api, iqdii, liveapi } = config
export const JWT = () => {
	let nowUid = uid ? uid : JSON.parse(sessionStorage.getItem('yydsID'))
	let nowSession = uid && session ? session : JSON.parse(sessionStorage.getItem('yydsSession'))

	return service({
		url: `${api}/token?uid=${nowUid}&sessionId=${nowSession}`,
		method: 'get',
	})
}

export const queryArea = (data) => {
	//获取用户ip：Other&CN,uat环境ip定位不准，故而换成生产的接口
	return service({
		url: `${liveapi}/popularity/account/queryArea`,
		method: 'get',
	})
}

export const getCaptcheCode = (data) => {
	// 發送圖形驗證碼
	return service({
		url: `${iqdii}/jybapp/SendMsgService/GetCaptcheCode?org=org_jyb_mob&lang=chs&uid=&ver=7.3.0&version=6.0&network=WIFI`,
		method: 'post',
		data,
	})
}

export const mobilelogin = (data) => {
	//手机号短信验证登录
	return service({
		url: `${iqdii}/jybapp/login/mobilelogin`,
		method: 'post',
		data,
	})
}

export const getUserRegisterDate = (data) => {
	//登录埋点
	return service({
		url: `${iqdii}/jybapp/Activity/GetUserRegisterDate`,
		method: 'post',
		data,
	})
}

export const sendMsgAfterCheckCode = (data) => {
	//短信验证码
	return service({
		url: `${iqdii}/jybapp/SendMsgService/SendMsgAfterCheckCode`,
		method: 'post',
		data,
	})
}

export const BindPhone = (params, data) => {
	//绑定手机号
	return service({
		url: `${iqdii}/jybapp/SendMsgService/BindPhone?uid=${params.uid}&session=${params.session}`,
		method: 'post',
		data,
	})
}

export const Registration = (data) => {
	//手机号码验证是否注册
	return service({
		url: `${iqdii}/jybapp/Registration/UserNameExists`,
		method: 'post',
		data,
	})
}

export const MsgVerifyCode = (data) => {
	//手机号码验证短信获取
	return service({
		url: `${iqdii}/jybapp/SendMsgService/MsgVerifyCode`,
		method: 'post',
		data,
	})
}

export const SendMsgAfter = (data) => {
	//用户注册
	return service({
		url: `${iqdii}/jybapp/Registration/jybregister?org=org_jyb_mob&version=6.0&network=wifi&ver=7.1.0&lang=chs`,
		method: 'post',
		data,
	})
}

export const GetUserId = (data) => {
	//手机号码获取用户uid
	return service({
		url: `${iqdii}/jybapp/user/GetUserId?org=org_jyb_mob&version=6.0&network=wifi&ver=8.1.0&lang=chs`,
		method: 'post',
		data,
	})
}
// facebook校验接口
export const facebookMe = (token) => {
	return service({
		url: `https://graph.facebook.com/me?access_token=${token}`,
		method: 'get',
	})
}
// 交易宝API第三方登录接口
export const thridLogin = (data) => {
	return service({
		url: `${iqdii}/jybapp/login/3rd-login?lang=cht&network=wifi&version=6.0&org=org_jyb_mob&source=AIPO`,
		method: 'post',
		data,
	})
}
