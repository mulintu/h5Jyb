<template>
	<div>
		<div id="vueEle">
			<!-- 绑定手机号码 -->
			<van-action-sheet v-model:show="normalLogin" :title="$t('text.BindMobile')" class="loginAlert" @close="onClose">
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
					<van-field v-model="sms" center clearable :placeholder="$t('text.pleaseSMSCode')" maxlength="5">
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
					{{ $t('text.bind') }}
				</van-button>
			</van-action-sheet>
			<!-- 图形验证码弹框 -->
			<va-dialog
				v-model:show="imgCode"
				class="imgCodeAlert"
				:confirm-button-text="$t('text.confirm')"
				confirm-button-color="#3E90F0"
				@confirm="sendImgCode"
			>
				<img :src="codeImg" />
				<p class="againCode pointer" @click="againCode">
					{{ $t('text.changeIt') }}
				</p>
				<van-field v-model="inputCode" :placeholder="$t('text.pleaseVerCode')" maxlength="4" input-align="center" />
			</va-dialog>
		</div>
	</div>
</template>
<script>
import { Toast, Dialog } from 'vant'
import { lang } from '@js/msg'
import CryptoJS from 'crypto-js'
import { toRefs, reactive, onMounted, watch, ref } from 'vue'
import { useUsersStore } from '@/store/user'
import utils from '@js/Utils'
import { useI18n } from 'vue-i18n'
import { BindPhone } from '@api/publicIndex'
export default {
	components: {
		'va-dialog': Dialog.Component,
	},
	props: {
		bindProp: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['updateBindProp'],
	setup(props, ctx) {
		const { t } = useI18n()
		const store = useUsersStore()
		const state = reactive({
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
			Telmaxlength: 11,
			errorMsg: '',
			codeImg: '',
			isLoadingLogin: false,
			codeBtn: t('text.sendVerCode'),
			random6: '',
			errorState: false,
			phonePlaceholder: t('text.pleasePhone'),
		})

		watch(
			() => props.bindProp,
			(newVal, oldVal) => {
				state.normalLogin = newVal
			}
		)

		const onClose = () => {
			ctx.emit('updateBindProp', false)
		}

		const protocolCheck = () => {
			state.isLogin != state.isLogin
		}
		const changeAddress = (num) => {
			state.address0 = false
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
			state.phonePlaceholder = t('text.pleasePhone')
		}
		const blurTel = () => {
			if (state.address == '+86') {
				;(!/^1(3|4|5|6|7|8|9)\d{9}$/.test(state.tel) &&
					(((state.errorState = true), (state.phonePlaceholder = t('text.tips2')), (state.tel = '')), true)) ||
					((state.errorState = false), (state.phonePlaceholder = t('text.pleasePhone')))
			} else {
				;(!/^(5|6|8|9)\d{7}$/.test(state.tel) && (((state.errorState = true), (state.phonePlaceholder = t('text.tips2')), (state.tel = '')), true)) ||
					((state.errorState = false), (state.phonePlaceholder = t('text.pleasePhone')))
			}
		}
		const sendCode = () => {
			//圖形驗證碼
			if (state.tel == '' || state.errorState) {
				Toast(t('text.pleasePhone'))
				return false
			}
			state.inputCode = ''
			state.random6 = parseInt(Math.random() * 100000000000)
			// https://cloudapi.iqdii.com/CaptcheService/Code?key=666666
			console.log(state.random6)
			state.imgCode = true
			state.codeImg = `https://cloudapi.iqdii.com/CaptcheService/Code?key=${state.random6}`

			// console.log("发送验证码")
		}
		const onSubmit = () => {
			//驗證驗證碼的正確性
			if (state.tel && state.sms) {
				loginTurn()
			} else {
				Toast(t('text.tips3'))
			}
		}
		const loginTurn = () => {
			if (!state.isLogin) {
				Toast(t('text.tips1'))
				return false
			}
			state.isLoadingLogin = true
			let obj = {
				uid: store.getUid,
				method: 'checkCode',
				old: '',
				_new: state.tel,
				verify_code: state.sms,
				keycode: '',
				captchecode: '',
				smstype: 'local',
				nationCode: state.address.slice(1),
				specifiedChannel: '0',
				userSignature: '',
			}
			console.log(obj)
			console.log(encrypt(JSON.stringify(obj)))
			let params = {
				key: encrypt(JSON.stringify(obj)),
			}
			BindPhone({ uid: store.getUid, session: store.getSession }, params)
				.then((res) => {
					state.isLoadingLogin = false
					if (res.data.result == 1) {
						sessionStorage.setItem('JYBMobile', JSON.stringify(state.tel))
						utils.setCookie(
							'newh5Info',
							JSON.stringify({
								loginH5: true,
								uids: store.getUid,
								session: store.getSession,
								phone: state.tel,
							}),
							2 / 24
						)
						state.normalLogin = false
						Toast(res.data.msg)
						// 绑定手机号成功,更新抽奖次数
						// state.$emit("triggerBind");
					} else {
						Toast(res.data.msg)
					}
				})
				.catch((err) => {
					console.log(err)
					state.isLoadingLogin = false
				})
		}
		/**
		 * AES加密（CBC模式，需要偏移量）
		 * @param data
		 * @returns {*}
		 */
		const encrypt = (data) => {
			// AES 秘钥
			var AesKey = 'D65B1E8997A1476C'

			// AES-128-CBC偏移量
			var CBCIV = 'D65B1E8997A1476C'

			// 加密选项
			var CBCOptions = {
				iv: CryptoJS.enc.Utf8.parse(CBCIV),
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7,
			}
			var key = CryptoJS.enc.Utf8.parse(AesKey)
			var secretData = CryptoJS.enc.Utf8.parse(data)
			var encrypted = CryptoJS.AES.encrypt(secretData, key, CBCOptions)
			return encrypted.toString()
		}
		/**
		 * AES解密（CBC模式，需要偏移量）
		 * @param data
		 * @returns {*}
		 */
		const decrypt = (data) => {
			// AES 秘钥
			var AesKey = 'D65B1E8997A1476C'

			// AES-128-CBC偏移量
			var CBCIV = 'D65B1E8997A1476C'

			// 加密选项
			var CBCOptions = {
				iv: CryptoJS.enc.Utf8.parse(CBCIV),
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7,
			}
			var key = CryptoJS.enc.Utf8.parse(AesKey)
			var decrypt = CryptoJS.AES.decrypt(data, key, CBCOptions)
			return CryptoJS.enc.Utf8.stringify(decrypt).toString()
		}
		const sendImgCode = (type) => {
			//短信驗證碼
			if (state.inputCode == '') {
				Toast(t('text.pleaseVerCode'))
				return false
			}
			let obj = {
				uid: store.getUid,
				method: 'sendCode',
				old: '',
				_new: state.tel,
				verify_code: '',
				keycode: state.random6,
				captchecode: state.inputCode,
				smstype: 'local',
				nationCode: state.address.slice(1),
				specifiedChannel: '0',
				userSignature: '',
			}
			console.log(obj)
			console.log(encrypt(JSON.stringify(obj)))
			let params = {
				key: encrypt(JSON.stringify(obj)),
			}
			// http://jybapisit.iqdii.com/jybapp/SendMsgService/BindPhone?uid=888316150&session=CA1ADC1BBF2AF2C690C3B876
			BindPhone({ uid: store.getUid, session: store.getSession }, params)
				.then((res) => {
					if (res.data.result == 1) {
						Toast(res.data.msg)
						setTimers()
					} else {
						Toast(res.data.msg)
					}
				})
				.catch((err) => {
					console.log(err)
					Toast(err)
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
						state.codeBtn = t('text.sendVerCode')
						state.isLoadingLogin = false
						state.isSend = false
						// Toast("登錄失敗");
						clearInterval(timer)
					}
				}, 1000))
		}

		return {
			...toRefs(state),
			onClose,
			protocolCheck,
			changeAddress,
			focusTel,
			blurTel,
			sendCode,
			onSubmit,
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
	.loginAlert .fied_box .van-cell {
		width: 65%;
		margin-left: 27%;
		text-indent: 0em !important;
		background: #f6f6ff;
		line-height: 40px;
		height: 40px;
		padding: 0;
	}
	:deep(.van-field__body) {
		height: 100%;
	}
	.loginAlert .fied_box2 .van-cell {
		margin-left: 7%;
		width: 85%;
	}
	.fied_box {
		height: 40px;
	}
	.fied_box1 {
		position: relative;
		// margin-top: 20px;
	}
	.fied_box2 {
		margin-top: 18px;
	}
	.van-action-sheet__header {
		font-size: 18px;
		line-height: 61.5px;
		color: #000000;
	}
	:deep(.van-action-sheet__close) {
		font-size: 18px;
		color: #a9a9a9;
	}
	:deep(.van-field__body .van-icon-clear) {
		font-size: 20px;
	}
	// 协议
	.loginProtocol {
		display: flex;
		align-items: center;
		width: 100%;
		position: absolute;
		bottom: 10px;
	}

	.loginProtocol .protocolCheck {
		margin-left: 30px;
		margin-right: 5px;
	}

	.protocolCheck .van-checkbox__icon {
		margin-left: 15px;
	}

	.loginProtocol .protocolText {
		flex: 9;
		font-size: 0.32rem;
		text-align: left;
		color: #999999;
	}

	.loginProtocol .protocolText a {
		color: #3a4fd0;
	}
	// 区号选择
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

	.van-cell {
		// padding: 0.267rem 0.427rem;
		font-size: 0.4rem;
	}

	.dropdown_menu_list li {
		height: 0.8rem;
		line-height: 0.8rem;
		padding: 2.5px;
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
	// 按钮
	.loginAlert .loginBtn {
		display: block;
		width: 86%;
		margin: 0 auto;
		margin-top: 15px;
		margin-bottom: 40px;
		height: 50px;
		line-height: 50px;
		// background-color: transparent;
		// background-image: url('../../assets/img/foot1.png');
		// background-repeat: no-repeat;
		// background-size: 100% 100%;
		background: linear-gradient(270deg, #6e33f2, #ae3ff2);
		color: #fff;
		border-radius: 44px;
		border: 0;
	}
	// 图形验证码
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
	.imgCodeAlert.van-dialog {
		width: 5.5rem;
	}
	// 获取验证码按钮
	.van-button--small {
		height: 40px;
		width: 92.5px;
		font-size: 0.36rem;
		vertical-align: middle;
		// background-image: url('../../assets/img/sedCode.png');
		// background-repeat: no-repeat;
		// background-size: 100% 100%;
		// background-color: #fff;
		background: #f6f6ff;
		color: #3a4fd0;
		border: 0;
		&:active {
			// border-radius: 10px;
		}
	}
	.van-button:active::before {
		opacity: 0;
	}
	.van-button--normal {
		font-size: 0.45rem;
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
		height: 25px;
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
</style>
