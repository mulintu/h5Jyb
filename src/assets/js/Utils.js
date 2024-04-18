export const isUat = location.origin.includes('uat') || location.origin.includes('192.168.') || location.origin.includes('file://')
/**
 * 自定义公共函数
 */
const utils = {
	/**
	 *  设置cookie值
	 * @param {string}  cname    cookie名称
	 * @param {string}  cvalue   cookie值
	 * @param {number}  exdays   cookie保存天数
	 */
	setCookie(cname, cvalue, exdays = 720) {
		var d = new Date()
		d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
		var expires = 'expires=' + d.toUTCString()
		document.cookie = cname + '=' + cvalue + '; ' + expires + ';path=/'
	},
	/**
	 *@param {string}  cname    要获取的cookie名称
	 */
	getCookie(name) {
		var arr,
			reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
		if ((arr = document.cookie.match(reg))) return unescape(arr[2])
		else return null
	},
	/**
	 * 清除cookie值
	 *  @param {string}  cname   cookie名称
	 */
	clearCookie(cname) {
		var d = new Date()
		d.setTime(-1)
		var expires = 'expires=' + d.toUTCString()
		document.cookie = cname + "=''; " + expires
	},
}
export default utils
