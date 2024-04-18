<template>
	<div>
		<img class="loginImg pointer" :src="bg8" @click="toFB" />
		<p class="phone">facebook</p>
	</div>
</template>
<script>
import { getCaptcheCode, mobilelogin, JWT, getUserRegisterDate, sendMsgAfterCheckCode } from '@api/publicIndex'
import { type, lang, session, uid } from '@js/msg'
import { isUat } from '@js/Utils'
import { toRefs, reactive, onMounted, watch, ref } from 'vue'
import { Toast, Dialog } from 'vant'
import i18n from '../../language/index'
import img2 from '@img/fullMarket/icon_fb.png'

export default {
	props: {
		isLogin: {
			type: Boolean,
			default: false,
		},
	},
	setup(props, ctx) {
		const state = reactive({
			bg8: img2,
		})
		const toFB = () => {
			if (!props.isLogin) {
				Toast(`${i18n.global.t('text.tips1')}`)
				return false
			}
			window.location.href = `https://www.facebook.com/dialog/oauth?client_id=454198328712444&redirect_uri=${window.origin}/FifthAnniversaryActivities/?QFLL=true&scope=email&response_type=token`
			// window.location = `http${isUat ? 's' : 's'}://aipo${
			// 	isUat ? 'uat' : ''
			// }.myiqdii.com/ExtraLogin/FaceBookLogin?source=FifthAnniversaryActivitiesProject` //facebook登录地址
			// if (session && uid) {
			// 	setCookie('fullMiscellaneous', JSON.stringify({ session, uid }))
			// }
		}
		//写cookies
		// const setCookie = (name, value, date = 0.125) => {
		// 	var Days = date
		// 	var exp = new Date()
		// 	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
		// 	document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
		// }

		return {
			...toRefs(state),
			toFB,
			// setCookie,
		}
	},
}
</script>
<style lang="scss" scoped>
.btnBox .loginImg {
	width: 1.8rem;
}

.phone {
	text-align: center;
	font-size: 18px;
	margin: 0;
	margin-top: 10px;
}

.pointer {
	cursor: pointer;
}
</style>
