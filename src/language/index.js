import { createI18n } from 'vue-i18n'
import chs from './chs'
import cht from './cht'
import { lang } from '../assets/js/msg'
import { Locale } from 'vant'
import enUS from 'vant/es/locale/lang/en-US'
import zhCN from 'vant/es/locale/lang/zh-CN'
import zhHK from 'vant/es/locale/lang/zh-HK'

const i18n = createI18n({
	legacy: false,
	locale: lang,
	messages: {
		chs: chs,
		cht: cht,
	},
})

const setVantLang = () => {
	if (lang === 'en') {
		Locale.use('en-US', enUS)
	} else if (lang === 'cht') {
		Locale.use('zh-HK', zhHK)
	} else {
		Locale.use('zh-CN', zhCN)
	}
}

setVantLang()

export default i18n
