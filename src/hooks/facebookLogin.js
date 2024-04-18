import { facebookMe, thridLogin } from '@api/publicIndex'
import { Toast } from 'vant'
async function facebookLogin() {
	const accToken = getQueryParam('access_token')
	if (accToken) {
		const resultMe = await facebookMe(accToken)
		if (resultMe.data.id) {
			const pm = {
				_3rd_uid: resultMe.data.id,
				_3rd_token: accToken,
				_3rd_type: 'fb',
				source: 'AIPO', //source,
				unionid: '',
				userName: resultMe.data.id,
				password: 'aipo_fb',
				passtype: 5,
			}
			const resultJYB = await thridLogin(pm)
			if (resultJYB.data.result == 1) {
				sessionStorage.setItem('yydsID', JSON.stringify(resultJYB.data.data.uid))
				sessionStorage.setItem('yydsSession', JSON.stringify(resultJYB.data.data.session))
				setCookie(
					'FifthAnniversaryActivitiesInfo',
					JSON.stringify({
						loginH5: true,
						uids: resultJYB.data.data.uid,
						session: resultJYB.data.data.session,
						phone: '',
					}),
					24 / 24
				)
				// window.location.href = `${window.origin}/FifthAnniversaryActivities/?QFLL=true`
			} else {
				// 调用捷利交易宝第三方接口失败（facebook）
				Toast('調用捷利交易寶第三方接口失敗（facebook）')
			}
			return {
				resultJYB,
			}
		} else {
			// 获取用户信息失败，请重新登录
			Toast('獲取用戶信息失敗，請重新登錄')
		}
	}
}
function setCookie(name, value, date = 0.125) {
	var Days = date
	var exp = new Date()
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
	document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}
function getQueryParam(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
	var href = window.location.href.replace('#', '&')
	var r = href.substr(href.indexOf('?')).substr(1).match(reg)
	if (r != null) return unescape(r[2])
	return null
}
export default facebookLogin
