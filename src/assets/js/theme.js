//判断主题
import { isNight } from '@js/msg.js'

//css js
const setTheme = () => {
	if (isNight) {
		document.body.setAttribute('theme', 'dark')
	} else {
		document.body.removeAttribute('theme')
	}
}
setTheme()
