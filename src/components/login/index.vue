<template>
	<div id="vueEle">
		<!-- 登录弹出层 -->
		<van-action-sheet v-model:show="login" :title="$t('text.loginRegister')" style="height: 6rem" class="loginAlert" @close="onClose">
			<ul class="fied_box btnBox row-a-r" style="height: 3rem">
				<li>
					<img class="loginImg pointer" :src="bg7" @click="toBill" />
					<p class="phone">mobile phone</p>
				</li>
				<li>
					<facebook-login :is-login="isLogin"></facebook-login>
				</li>
			</ul>
			<div class="loginProtocol">
				<van-checkbox v-model="isLogin" type="checkbox" class="protocolCheck" @click="protocolCheck"></van-checkbox>
				<p class="protocolText">
					{{ $t('text.agree1') }}
					<a href="https://pay.iqdii.com/Pay/Agreement">{{ $t('text.agree2') }}</a>
					{{ $t('text.agree3') }}
					<a href="https://pay.iqdii.com/Protocol/PrivacyPolicy.html">{{ $t('text.agree4') }}</a
					>。
				</p>
			</div>
		</van-action-sheet>

		<!-- 手机号码登录 -->
		<van-action-sheet
			v-model:show="normalLogin"
			:title="$t('text.LoginRegister')"
			:class="['loginAlert', 'loginBox', { androidCenter: isAndroidQQ }]"
		>
			<div class="fied_box fied_box1">
				<div class="dropdown_menu pointer">
					<p @click="address0 = !address0">
						<span>{{ address }}</span>
						<b></b>
					</p>
				</div>
				<ul v-if="address0" class="dropdown_menu_list">
					<li class="pointer" @click="changeAddress(852)">+852</li>
					<li class="pointer" @click="changeAddress(853)">+853</li>
					<li class="pointer" @click="changeAddress(86)">+86</li>
				</ul>
				<van-field
					v-model="tel"
					clearable
					:placeholder="phonePlaceholder"
					type="tel"
					class="fieldBox"
					:maxlength="Telmaxlength"
					:error="errorState"
					@focus="focusTel"
					@blur="blurTel"
				/>
			</div>
			<div class="fied_box fied_box2">
				<van-field
					v-model="sms"
					center
					clearable
					:placeholder="$t('text.pleaseSMSCode')"
					maxlength="5"
					@focus="isAndroidQQ = isAndroid && isQQ"
					@blur="isAndroidQQ = false"
				>
					<template #button>
						<van-button v-show="!isSend" size="small" type="info" @click="sendCode">{{ $t('text.sendSMSCode') }} </van-button>
						<van-button v-show="isSend" size="small" type="info" disabled>{{ codeBtn }}s</van-button>
					</template>
				</van-field>
			</div>
			<div class="loginProtocol">
				<van-checkbox v-model="isLogin" type="checkbox" class="protocolCheck" @click="protocolCheck"> </van-checkbox>
				<p class="protocolText">
					{{ $t('text.agree1') }}
					<a href="https://pay.iqdii.com/Pay/Agreement">{{ $t('text.agree2') }}</a>
					{{ $t('text.agree3') }}
					<a href="https://pay.iqdii.com/Protocol/PrivacyPolicy.html">{{ $t('text.agree4') }}</a
					>。
				</p>
			</div>
			<van-button type="info" class="loginBtn" :loading="isLoadingLogin" :disabled="isLoadingLogin" @click="onSubmit">
				{{ $t('text.login') }}
			</van-button>
		</van-action-sheet>

		<!-- 图形验证码弹框 -->
		<va-dialog
			v-model:show="imgCode"
			class="imgCodeAlert"
			:confirm-button-text="$t('text.confirm')"
			confirm-button-color="#3E90F0"
			:before-close="imgCodeColse"
			overlay-class="imgCodeDia"
		>
			<van-icon name="cross" class="closeBtn" @click="imgCode = false" />
			<img :src="codeImg" />
			<p class="againCode pointer" @click="againCode">
				{{ $t('text.changeIt') }}
			</p>
			<van-field v-model="inputCode" :placeholder="$t('text.pleaseVerCode')" maxlength="4" input-align="center" />
		</va-dialog>
		<van-overlay :show="weixinShow" @click="weixinShow = !weixinShow">
			<img :src="bg9" style="width: 6.666rem; margin-left: 1.5rem" />
		</van-overlay>
	</div>
</template>
<script>
import { getCaptcheCode, mobilelogin, JWT, getUserRegisterDate, sendMsgAfterCheckCode } from '@api/publicIndex'
import { type, lang, session, uid } from '@js/msg'
import { isUat } from '@js/Utils'
import { toRefs, reactive, onMounted, watch, ref } from 'vue'
import { Toast, Dialog } from 'vant'
import i18n from '../language/index'
import { useRouter } from 'vue-router'
import img1 from '@img/fullMarket/icon_phone.png'
import img2 from '@img/fullMarket/icon_fb.png'
import img3 from '@img/fullMarket/alert.png'
import facebookLogin from '@components/facebookLogin/index.vue'
import { isAndroid } from '@js/AppInterfaceCommon'

export default {
	components: {
		'va-dialog': Dialog.Component,
	},
	props: {
		loginProp: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['updateNormalLogin'],
	setup(props, ctx) {
		const router = useRouter()
		const state = reactive({
			bg7: img1,
			bg8: img2,
			bg9: img3,

			login: false,
			isLogin: true,
			normalLogin: false,
			address: lang == 'chs' ? '+86' : '+852',
			address0: false,
			tel: '',
			sms: '',
			isSend: false,
			imgCode: false,
			inputCode: '',
			Telmaxlength: lang == 'chs' ? 11 : 8,
			errorMsg: '',
			codeImg: '',
			weixinShow: false,
			isLoadingLogin: false,
			codeBtn: `${i18n.global.t('text.sendVerCode')}`,
			errorState: false,
			phonePlaceholder: `${i18n.global.t('text.pleasePhone')}`,
			isAndroidQQ: false,
			// 华为荣耀 qq内置浏览器特殊处理
			isQQ:
				navigator.userAgent.toLowerCase().match(/QQ/i) == 'qq' &&
				navigator.userAgent.indexOf('MQQBrowser') == -1 &&
				navigator.userAgent.indexOf('HONOR') >= 0,
			isAndroid,
			// loginProp: true,
		})

		// onMounted(() => {
		//   console.log(props.normalLogin)
		// })

		watch(
			() => props.loginProp,
			(newVal, oldVal) => {
				state.login = newVal
			}
		)

		const toBill = () => {
			if (!state.isLogin) {
				Toast(`${i18n.global.t('text.tips1')}`)
				return false
			}
			state.login = false
			state.normalLogin = true
		}
		const onClose = () => {
			ctx.emit('updateNormalLogin', false)
		}
		const toFB = () => {
			if (!state.isLogin) {
				Toast(`${i18n.global.t('text.tips1')}`)
				return false
			}
			// https://cloudh5.iqdii.com/other/fulldrawImg?session=142B77A60BF933C70BD8CAEB&org=jyb&uid=887267160&lang=cht
			window.location = `http${isUat ? 's' : 's'}://aipo${
				isUat ? 'uat' : ''
			}.myiqdii.com/ExtraLogin/FaceBookLogin?source=FifthAnniversaryActivitiesProject` //facebook登录地址
			if (session && uid) {
				setCookie('fullMiscellaneous', JSON.stringify({ session, uid }))
			}
		}
		//写cookies
		const setCookie = (name, value, date = 0.125) => {
			var Days = date
			var exp = new Date()
			exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
			document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
		}
		//读取cookies
		const getCookie = (name) => {
			var arr,
				reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
			if ((arr = document.cookie.match(reg))) return unescape(arr[2])
			else return null
		}
		const protocolCheck = () => {
			state.isLogin != state.isLogin
		}
		const changeAddress = (num) => {
			state.address0 = false
			state.errorState = false
			state.phonePlaceholder = `${i18n.global.t('text.pleasePhone')}`
			state.address = `+${num}`
			state.tel = ''
			if (num == 86) {
				state.Telmaxlength = 11
			} else {
				state.Telmaxlength = 8
			}
		}
		const focusTel = () => {
			state.address0 = false
			state.errorState = false
			state.phonePlaceholder = `${i18n.global.t('text.pleasePhone')}`
			state.isAndroidQQ = state.isAndroid && state.isQQ
		}
		const blurTel = () => {
			if (state.address == '+86') {
				;(!/^1(3|4|5|6|7|8|9)\d{9}$/.test(state.tel) &&
					(((state.errorState = true), (state.phonePlaceholder = `${i18n.global.t('text.tips2')}`), (state.tel = '')), true)) ||
					((state.errorState = false), (state.phonePlaceholder = `${i18n.global.t('text.pleasePhone')}`))
			} else {
				;(!/^(5|6|8|9)\d{7}$/.test(state.tel) &&
					(((state.errorState = true), (state.phonePlaceholder = `${i18n.global.t('text.tips2')}`), (state.tel = '')), true)) ||
					((state.errorState = false), (state.phonePlaceholder = `${i18n.global.t('text.pleasePhone')}`))
			}
			state.isAndroidQQ = false
		}
		const sendCode = () => {
			//圖形驗證碼
			if (state.tel == '' || state.errorState) {
				Toast(`${i18n.global.t('text.pleasePhone')}`)
				return false
			}
			state.inputCode = ''
			let params = {
				requestType: 1,
				keycode: state.tel,
			}
			getCaptcheCode(params)
				.then((res) => {
					if (res.data.result == 1) {
						state.imgCode = true
						state.codeImg = `${res.data.msg.replace('https', 'http')}&${Date.now()}`
					}
				})
				.catch((err) => {
					console.log(err)
				})
			// console.log("发送验证码")
		}
		const onSubmit = () => {
			//驗證驗證碼的正確性
			if (state.tel && state.sms) {
				loginTurn()
			} else {
				Toast(`${i18n.global.t('text.tips3')}`)
			}
		}
		const imgCodeColse = () => {
			// if (state.inputCode == '') {
			//   state.imgCode = true
			// } else {
			//   state.imgCode = false
			// }
			sendImgCode()
		}
		const loginTurn = () => {
			if (!state.isLogin) {
				Toast(`${i18n.global.t('text.tips1')}`)
				return false
			}
			state.isLoadingLogin = true
			let params = {
				mobile: state.tel,
				code: state.sms,
			}
			mobilelogin(params)
				.then((res) => {
					state.isLoadingLogin = false
					if (res.data.result == 1) {
						state.normalLogin = false
						let sessions = res.data.data.session
						let uids = res.data.data.uid
						let fullIp = res.data.data.PkgData.country_id
						let phone = ''
						let userName = ''
						if (res.data.data.passport && res.data.data.passport.ph) {
							phone = res.data.data.passport.ph
						}
						if (res.data.data.profile && res.data.data.profile.unn) {
							userName = res.data.data.profile.unn
						}
						setCookie('fullMiscellaneous', JSON.stringify({ sessions, uids }))
						setCookie('fullIp', JSON.stringify({ fullIp }))
						// state.loginValue = true;
						sessionStorage.setItem('yydsID', JSON.stringify(uids))
						sessionStorage.setItem('yydsSession', JSON.stringify(sessions))
						sessionStorage.setItem('JYBMobile', JSON.stringify(phone))
						// sessionStorage.setItem("JYBUserName", JSON.stringify(userName));
						// festivalGiftPackage({}).then(() => {});
						setCookie(
							'FifthAnniversaryActivitiesInfo',
							JSON.stringify({
								loginH5: true,
								uids,
								session: sessions,
								phone,
							}),
							24 / 24
						)
						JWT()
							.then((res) => {
								console.log(res)
								location.reload()
								// 登录埋点
							})
							.catch((err) => {
								console.log(err)
							})
					} else {
						Toast(res.data.msg)
					}
				})
				.catch((err) => {
					console.log(err)
					state.isLoadingLogin = false
					// state.loginValue = false;
				})
		}
		const sendImgCode = (type) => {
			//短信驗證碼
			if (state.inputCode == '') {
				Toast(`${i18n.global.t('text.pleaseVerCode')}`)
				return false
			}
			let params = {
				mobile: state.tel,
				captcheKey: state.codeImg
					.split('?')[1]
					.split('&')
					.find((ele) => ele.includes('key'))
					.split('=')[1],
				captcheCode: type ? '' : state.inputCode, //驗證碼
			}
			sendMsgAfterCheckCode(params)
				.then((res) => {
					if (res.data.result == 1) {
						state.imgCode = false
						setTimers()
					}
					if (res.data.result == 1 && res.data.msg == `${i18n.global.t('text.successful')}`) {
						loginTurn()
					}
					if (res.data.result == -490) {
						Toast(`${i18n.global.t('text.text1')}`)
						againCode()
					}
					if (res.data.result == -488) {
						Toast(`${i18n.global.t('text.text2')}`)
					}
				})
				.catch((err) => {
					console.log(err)
				})
		}
		const againCode = () => {
			sendCode()
		}
		const setTimers = () => {
			let timer = null
			state.codeBtn = 60
			;(state.isSend = true),
				(timer = setInterval(() => {
					state.codeBtn--
					if (state.codeBtn == 0) {
						state.codeBtn = `${i18n.global.t('text.sendVerCode')}`
						state.isLoadingLogin = false
						state.isSend = false
						// state.$toast("登錄失敗");
						clearInterval(timer)
					}
				}, 1000))
		}

		return {
			...toRefs(state),
			toBill,
			onClose,
			toFB,
			setCookie,
			getCookie,
			protocolCheck,
			changeAddress,
			focusTel,
			blurTel,
			sendCode,
			onSubmit,
			imgCodeColse,
			loginTurn,
			sendImgCode,
			againCode,
			setTimers,
		}
	},
}
</script>
<style lang="scss" scoped>
#vueEle {
	.loginAlert .van-field__error-message {
		margin-top: 5px !important;
	}

	.loginAlert .fied_box .van-cell {
		width: 65%;
		// margin: 0 auto;
		margin-left: 27%;
		// margin-top: -20px;
		text-indent: 0em !important;
		background: #f6f6ff;
		height: 40px;
		line-height: 40px;
		padding: 0;
		border-radius: 0 8px 8px 0;
	}

	.loginAlert .fied_box2 .van-cell {
		margin-left: 7%;
		width: 85%;
		background: #f6f6ff;
	}

	.van-field__controlt {
		text-indent: 4em;
	}

	.fied_box .border_line {
		border-bottom: 1px solid #f1f1f1;
	}

	.btnBox {
		display: flex;
		padding: 0.4rem 10px;
		padding-bottom: 0;
	}

	.btnBox li {
		width: 50%;
		text-align: center;
	}

	.btnBox .loginImg {
		width: 1.8rem;
		// margin-bottom: 12px;
		// margin-left: 80px;
	}

	.btnBox p {
		font-size: 18px;
		margin: 0;
		margin-top: 10px;
	}

	.phone {
		text-align: center;
	}

	.row-a-r {
		justify-content: space-around;
	}

	.loginProtocol {
		display: flex;
		// line-height: 0.8rem;
		// margin-top: 15px;
		align-items: center;
		width: 100%;
		position: absolute;
		bottom: 10px;
	}

	.loginProtocol .protocolCheck {
		// flex: 0.3;
		// margin-top: 20px;
		margin-left: 30px;
		margin-right: 5px;
	}

	// .loginProtocol .protocolCheck .van-checkbox__icon {
	//   margin: 0 auto;

	// }
	.protocolCheck .van-checkbox__icon {
		margin-left: 30px;
	}

	.loginProtocol .protocolText {
		flex: 9;
		font-size: 12px;
		text-align: left;
		color: #999999;
	}

	.loginProtocol .protocolText a {
		// color: rgb(62, 144, 240);
		color: #3a4fd0;
		font-size: 12px;
	}

	.dropdown_menu {
		width: 20%;
		height: 40px;
		position: absolute;
		left: 7%;
		// top: -0.15rem;
		z-index: 2;
		line-height: 40px;
		text-align: center;
		color: #3a4fd0;
		font-size: 0.4rem;
		white-space: nowrap;
		background: #f6f6ff;
		border-radius: 8px 0 0 8px;

		::after {
			content: '';
			position: absolute;
			top: 50%;
			right: 0;
			width: 2px;
			height: 20px;
			transform: translateY(-50%);
			background: #c4c4c9;
		}
	}

	.dropdown_menu_list {
		width: 20%;
		position: absolute;
		left: 0.7rem;
		top: 0.9rem;
		z-index: 2;
		color: #333;
		font-size: 0.4rem;
		background-color: #fff;
		text-align: center;
		box-shadow: 0px 13px 21px 0px rgba(153, 153, 153, 0.5);
	}

	.isPC.phoneBuy .dropdown_menu_list,
	.isPC.phoneBuy .dropdown_menu {
		left: 0.8rem;
		line-height: 0.8rem;
	}

	.isPC.phoneBuy .dropdown_menu {
		height: 0.8 rem;
		width: 10%;
		max-width: 3rem;
	}

	.isPC.phoneBuy .dropdown_menu_list {
		top: 0.8rem;
		width: 10%;
		max-width: 3rem;
	}

	.van-cell {
		// padding: 0.267rem 0.427rem;
		font-size: 0.4rem;
	}

	.van-hairline--top .van-dialog__confirm {
		height: 1.2rem;
		font-size: 16px;
	}

	.dropdown_menu_list li {
		height: 0.8rem;
		line-height: 0.8rem;
		padding: 5px;
	}

	.dropdown_menu_list li:first-child {
		border-bottom: 1px solid #ebedf0;
	}

	.dropdown_menu p {
		height: 40px;
		line-height: 40px;
		margin: 0;
	}

	.dropdown_menu p b {
		display: inline-block;
		width: 0;
		height: 0;
		border-right: 0.11rem solid transparent;
		border-left: 0.11rem solid transparent;
		border-top: 0.2rem solid #999999;
		margin-left: 0.1rem;
	}

	.pointer {
		cursor: pointer;
	}

	.fied_box .border_line {
		border-bottom: 1px solid #f1f1f1;
	}

	.loginAlert .loginBtn {
		display: block;
		width: 86%;
		margin: 0 auto;
		margin-top: 10px;
		margin-bottom: 10px;
		height: 47px;
		line-height: 87px;
		// background-color: transparent;
		// background-image: url("../../assets/img/foot1.png");
		// background-repeat: no-repeat;
		// background-size: 100% 100%;
		background: linear-gradient(270deg, #6e33f2, #ae3ff2);
		background: linear-gradient(270deg, #fd3915 0%, #ff4d77 100%);
		color: #fff;
		border-radius: 44px;
		border: 0;
	}

	.imgCodeAlert img {
		display: block;
		width: 2.52rem;
		height: 1.2rem;
		margin: 0 auto;
		background-color: #edf7ff;
		margin-top: 0.7rem;
		margin-bottom: 0.3rem;
	}

	.imgCodeAlert p {
		text-align: center;
		color: #3e90f0 !important;
		font-size: 0.36rem !important;
	}

	.imgCodeAlert .van-cell {
		width: 80%;
		height: 1rem;
		line-height: 0.7rem;
		text-align: center;
		margin: 20px auto;

		border: 1px dashed #f1f1f1;
	}

	.imgCodeAlert .van-cell input {
		text-align: center;
	}

	.imgCodeAlert .van-button {
		height: 2rem !important;
	}

	// .imgCodeAlert {
	//   display: none;
	// }
	.phoneBuy .imgCodeAlert {
		display: block;
	}

	.imgCodeAlert.van-dialog {
		width: 5.5rem;
		box-shadow: #f98b17 0 0 10px;
		.closeBtn {
			position: absolute;
			top: 15px;
			right: 15px;
			font-size: 20px;
			color: #a9a9a9;
		}
	}

	.van-button--small {
		height: 45px;
		width: 100px;
		font-size: 0.36rem;
		vertical-align: middle;
		// background-image: url("../../assets/img/sedCode.png");
		// background-repeat: no-repeat;
		// background-size: 100% 100%;
		background: #f6f6ff;
		color: #3a4fd0;
		border: 0;

		&:active {
			// border-radius: 20px;
		}
	}

	.van-button:active::before {
		opacity: 0;
	}

	.van-button--normal {
		font-size: 0.42rem;
	}

	.van-dialog__confirm {
		height: 1.2rem;
	}

	.van-toast {
		// line-height: 1.333rem;
		font-size: 0.6rem;
		width: 10rem;
	}

	.van-toast--html,
	.van-toast--text {
		min-width: 2.3rem;
		padding: 0.3rem 0.16rem;
	}

	.van-dialog__footer {
		height: 50px;
	}
}

input.van-field__control::-webkit-input-placeholder {
	color: red;
}

.box {
	background-color: #fff;
}

.imgBox {
	margin: 0 auto;
	max-width: 10rem;
}

.shareImg1 {
	width: 10rem;
	height: 12.8rem;
}

.toShareImg {
	width: 70%;
	height: 1.8rem;
	background-repeat: no-repeat;
	background-size: 100%;
	position: absolute;
	top: 4.3rem;
	left: 50%;
	transform: translate(-50%, 22%);
	// background-image: url('../../assets/img/fullMarket/fenxiang.png');
}

.shareImg2 {
	width: 10rem;
	height: 18.4rem;
	// background-image: url('@/img/fullMarket/shouye2.png');
	background-repeat: no-repeat;
	background-size: 100%;
	position: relative;
}

.shareImg3 {
	width: 10rem;
	height: 13.6rem;
}

.shareImg4 {
	width: 10rem;
	height: 21rem;
}

.fenxiang {
	width: 10rem;
	height: 2rem;
}

.fenxiang .img {
	width: 7rem;
	height: 2rem;
	position: absolute;
	top: 5.8rem;
	left: 50%;
	transform: translate(-50%, -50%);
}

.shouyi .img {
	width: 7rem;
	height: 1.5rem;
	position: absolute;
	top: 7.5rem;
	left: 50%;
	transform: translate(-50%, -50%);
}

.img {
	width: 100%;
	height: 100%;
}

.wu {
	text-align: center;
	margin-top: 0.5rem;
	color: #aaa9a5;
}

.xieyi {
	width: 10rem;
	height: 0.6rem;
	background-color: #ff5133;
	position: absolute;
	top: 36%;
	text-align: center;
}

.van-checkbox {
	display: inline-block;
}

.van-checkbox__icon {
	border: 0.01rem solid #ffdba2;
	height: 0.2rem;
	width: 0.2rem;
	background-color: #ff5133;
}

.van-checkbox__icon--checked .van-icon {
	color: #fff;
	background-color: #ffcf3f;
	border-color: #ffcf3f;
}

.van-checkbox__icon .van-icon {
	width: 0.2rem;
	height: 0.2rem;
	border: 0;
}

.fied_box {
	height: 47px;
}

.fied_box1 {
	position: relative;
	margin-top: 0px;
}

.fied_box2 {
	margin-top: 10px;
}

.van-action-sheet__header {
	font-size: 36px;
	line-height: 123px;
	color: #000000;
}

:deep(.van-action-sheet__close) {
	font-size: 18px;
	color: #a9a9a9;
}

.loginBox .van-action-sheet__close {
	right: 15px;
	top: 30px;
}

.fieldBox input {
	text-indent: 4em;
}

:deep(.fieldBox .van-field__body) {
	height: 100%;
}

:deep(.van-field__body .van-icon-clear) {
	font-size: 20px;
}

.van-icon-success:before {
	color: #ff5133;
}

.fenx {
	color: #ffdba2;

	.salesProtocol {
		a {
			color: #ffdba2;
		}
	}
}

.table {
	width: 7rem;
	height: 3rem;
	position: absolute;
	top: 57%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.invitation_list {
	width: 598/75 + rem;
	height: 430/75 + rem;
	margin: 0 auto;
	border-radius: 16/75 + rem;
	width: 7.30667rem;
	height: 5.4rem;
	margin: 0 auto;
	border-radius: 0.21333rem;
	background-color: #fff;

	.list_th {
		display: flex;
		padding: 10/75 + rem 30/75 + rem;

		span {
			flex: 1;
			color: #a6a9b6;
			font-size: 26/75 + rem;
		}

		span:nth-child(2) {
			text-align: right;
		}

		span:nth-child(3) {
			text-align: right;
		}
	}

	.list_th_1 {
		display: flex;
		padding: 10/75 + rem 30/75 + rem;

		span {
			flex: 1;
			color: #a6a9b6;
			font-size: 26/75 + rem;
			text-align: center;
		}
	}
}

.van-popup--bottom {
	max-width: 10rem;
	position: fixed;
	left: 50%;
	transform: translate(-50.1%, 0px);
}

.loginBox {
	/* position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); */
	max-width: calc(10rem - 78px);
	transform: none;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	margin: auto;
	background: url('../../assets/img/fullMarket/loginBox.png') center/100% 100% no-repeat;
	height: 618px;

	.van-action-sheet__header {
		margin-top: 30px;
		font-size: 37px;
		font-weight: bold;
		line-height: 105px;
	}
}
</style>
<style lang="scss">
.van-checkbox__label {
	color: #fff;
}

.loginBox .van-action-sheet__content {
	overflow: hidden;
	height: 200px;
}

.protocol .van-checkbox__icon--checked .van-icon {
	color: #dc040c;
}

.protocol .van-checkbox__icon .van-icon {
	border: 2px solid #fff;
}

#vueEle .van-field__error-message {
	font-size: 23px;
	background: #fff;
	line-height: 30px;
	padding-left: 28px;
}

.van-toast {
	line-height: 50px;
}

.loginAlert .van-field__control {
	padding-left: 13px;
}

.loginAlert {
	padding-bottom: 0;

	.van-field__button {
		background: #f6f6ff;
		padding-left: 19px;
		position: relative;

		::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 0;
			width: 1px;
			height: 19px;
			transform: translateY(-50%);
			background: #3a4fd0;
		}
	}

	.van-icon-clear {
		font-size: 40px;
	}
}

.imgCodeDia {
	z-index: 2003 !important;
}
.androidCenter {
	bottom: 50%;
	transform: translateY(50%);
}
</style>
