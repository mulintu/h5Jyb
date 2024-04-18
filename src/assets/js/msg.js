export const getUrlKey = function (name) {
	return decodeURIComponent((new RegExp(`[?|&]${name}=` + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
}

const print = {}
export const org = (print.org = getUrlKey('org') ? (getUrlKey('org').toLowerCase() == 'org_jyb_mob' ? '' : getUrlKey('org').toLowerCase()) : '')
export const lang = (print.lang = getUrlKey('lang') ? getUrlKey('lang').toLowerCase() : 'chs')
export const uid = (print.uid = getUrlKey('uid')
	? getUrlKey('uid')
	: JSON.parse(sessionStorage.getItem('yydsID'))
	? JSON.parse(sessionStorage.getItem('yydsID'))
	: '')
export const session = (print.sessions = getUrlKey('session')
	? getUrlKey('session')
	: JSON.parse(sessionStorage.getItem('yydsSession'))
	? JSON.parse(sessionStorage.getItem('yydsSession'))
	: '')
export const mobile = (print.mobile = getUrlKey('mobile')
	? getUrlKey('mobile')
	: JSON.parse(sessionStorage.getItem('JYBMobile'))
	? JSON.parse(sessionStorage.getItem('JYBMobile'))
	: '')
export const type = (print.type = getUrlKey('QFLL') ? getUrlKey('QFLL') : '')
export const ipVal = (print.ipVal = getUrlKey('ipVal')
	? getUrlKey('ipVal')
	: JSON.parse(sessionStorage.getItem('chinese'))
	? JSON.parse(sessionStorage.getItem('chinese'))
	: '')
export const source = (print.source = getUrlKey('source') ? getUrlKey('source') : '')
export const isNight = (print.isNight = getUrlKey('isNight') ? getUrlKey('isNight') === 'true' : false)

export default print
