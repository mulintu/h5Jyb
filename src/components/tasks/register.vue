<template>
	<div class="app">
		<div class="backgroundImg">
			<div class="tradegoLogo"></div>
			<!--	<div class="yearCenter">618年中狂歡</div>
			<div class="lastContent">港股&美股實時行情免費領</div> -->
		</div>
		<div class="verifyDiv">
			<div class="felxCheckDiv">
				<div class="userId">
					<img v-if="userlist" :src="userlist.head_url" class="userImg" @error="imgerror" />
					<div v-if="userlist" class="userName">{{ userlist.unn }} {{ listName }}</div>
					<!-- <div class="reportName"></div> -->
				</div>
				<div class="input_oh">
					<div class="areaCode">
						<span @click="changeArea">{{ areaCode }}</span>
						<b @click="changeArea"></b>
						<transition name="fade">
							<div v-if="show" class="areaList" @click="clickfun($event)">
								<p>+86</p>
								<p>+852</p>
							</div>
						</transition>
					</div>

					<van-field
						v-model="tel_sum"
						placeholder="請輸入手機號碼"
						:error-message="errorMsg"
						type="digit"
						:maxlength="Telmaxlength"
						@blur="telBlur"
						@focus="telFocus"
					/>
				</div>
				<div class="input_pass">
					<div class="codeImg" @click="getCap(1)">
						<van-image :src="codeUrl">
							<template #loading>
								<van-loading type="spinner" size="20" />
							</template>
						</van-image>
					</div>
					<van-field v-model="password" type="digit" placeholder="請輸入圖形驗證碼" maxlength="4" />
				</div>
				<div class="input_pass">
					<div class="telCodeBtn" @click="msgVerifyCode(1)">
						<div class="button">
							<span>{{ codeText }}</span>
						</div>
					</div>
					<van-field v-model="code" placeholder="請輸入短信驗證碼" maxlength="5" />
				</div>
				<div class="registered" @click="register">立即註冊</div>
			</div>
			<div class="loginProtocol">
				<van-checkbox v-model="isLogin" type="checkbox" class="protocolCheck" @click="protocolCheck"></van-checkbox>
				<span class="protocolText">
					我已閱讀並同意
					<a href="https://pay.iqdii.com/Pay/Agreement">用戶使用協議</a> 與
					<a href="https://pay.iqdii.com/Protocol/PrivacyPolicy.html">隱私政策</a>。</span
				>
			</div>
		</div>
		<van-popup v-model:show="trueTips3" :close-on-click-overlay="false" class="popupSty">
			<div class="pop_1">
				<div class="head_1"></div>
				<div v-if="oldUserpropTest[0]" class="thanks_content_1">{{ oldUserpropTest[0] }}</div>
				<div class="thanks_content_2">
					<div v-if="oldUserpropTest[1]" class="thanks_content_s">{{ oldUserpropTest[1] }}</div>
					<div v-if="oldUserpropTest[2]" class="thanks_content_s">{{ oldUserpropTest[2] }}</div>
					<div v-if="oldUserpropTest[3]" class="thanks_content_s">{{ oldUserpropTest[3] }}</div>
				</div>
				<div class="inviteButton" @click="RouterClick(goToActivity)"></div>
			</div>
			<img v-if="trueTips3" class="closeImg4" src="@img/doTasks/bgIcon2.png" @click="trueTips3 = false" />
		</van-popup>

		<van-popup v-model:show="trueTips" :close-on-click-overlay="false" class="popupSty">
			<div class="pop_1">
				<div class="head_2"></div>
				<div v-if="newUserpropTest[0]" class="thanks_content_1">{{ newUserpropTest[0] }}</div>
				<div class="thanks_content_2">
					<div v-if="newUserpropTest[1]" class="thanks_content_s">{{ newUserpropTest[1] }}</div>
					<div v-if="newUserpropTest[2]" class="thanks_content_s">{{ newUserpropTest[2] }}</div>
					<div v-if="newUserpropTest[3]" class="thanks_content_s">{{ newUserpropTest[3] }}</div>
				</div>
				<div class="inviteButton2" @click="dowmloadApp(goToDowmLoad)"></div>
			</div>
			<img v-if="trueTips" class="closeImg4" src="@img/doTasks/bgIcon2.png" @click="trueTips = false" />
		</van-popup>
	</div>
</template>

<script setup>
import { uid, lang, sesstion } from '@js/msg.js'
import { getPoints } from '@api/index'
import { useUsersStore } from '@/store/user'
import { ref, toRefs, reactive, watch, nextTick, inject, onMounted, onBeforeUnmount, computed } from 'vue'
import { getCaptcheCode, Registration, MsgVerifyCode, queryArea, SendMsgAfter, GetUserId } from '@api/publicIndex.js'
import { InviteNewUserInfo } from '@api/index.js'
import config from '@api/config.js'
import { Toast, Dialog } from 'vant'
import { useRouter } from 'vue-router'
import { GetUserProfile } from '@api/index'
import errorimg from '@img/bgHead.png'
import WXShare from '@js/wxshare'

// import QRCode from 'qrcodejs2-fix'
let inviterId = uid
const tbac = config
let newKey = ref('')
let trueTips = ref(false)
let trueTips3 = ref(false)
let show = ref(false) //号码选择现形字段
let keyCode = ref('') //随机数
let areaCode = ref(+86) //号码开头选择
let Telmaxlength = ref('') // 号码长度限制
let tel_sum = ref('')
let codeUrl = ref('')
let code = ref('')
let password = ref('')
let errorMsg = ref('')
let isLogin = ref(true)
let times = ref(60)
let codeText = ref('發送驗證碼')
const router = useRouter()

let NewUid = ref('')
let userlist = { head_url: errorimg }
function imgerror(e) {
	console.log((e.target.src = errorimg))
	e.target.src = errorimg
}

const props = defineProps({
	//邀请信息文字
	listName: {
		type: String,
		required: true,
	},
	//新用户注册成功文本
	newUserpropTest: {
		type: Array,
		required: true,
	},
	//老用户弹框文字
	oldUserpropTest: {
		type: Array,
		required: true,
	},
	//活动主页跳转
	goToActivity: {
		type: String,
		required: true,
	},
	//下载页面跳转
	goToDowmLoad: {
		type: String,
		required: true,
	},
})
const emit = defineEmits(['userInfo', 'invite', 'phoneSize'])
watch(tel_sum, (item, val) => {
	// console.log(item, val, 'tel_sumchange事件')
	emit('phoneSize', item)
})
//根据电话号码获取用户uid
function UserId() {
	let form = {
		key: tel_sum.value,
		type: 'mobile',
	}
	GetUserId(form).then((res) => {
		NewUid.value = res.data.data.uid
		emit('userInfo', NewUid.value)

		console.log(res, 'eeeeeeeee')
		if (res.data.result === 1) {
			// InviteNewUser()
			emit('invite')
		}
	})
}
//获取用户个人信息
function getInviterInfo() {
	console.log([`${inviterId}`])
	const data = {
		uid: inviterId,
	}
	GetUserProfile(data)
		.then((res) => {
			if (res.data.result == 1) {
				userlist = res.data.data
				console.log(res, 'rrrrrrrrrrrreeeeeeeeeeeeeeessssssssssss')
			}
		})
		.catch((err) => {
			console.log(err)
		})
}

function dowmloadApp(item) {
	// router.push('/download')
	router.push(item)
}
// emits('triggerLogin')

//邀请新用户成功
// function InviteNewUser() {
// 	let form = {
// 		invitorId: NewUid.value,
// 		invitorPhone: tel_sum.value,
// 		ip: store.getSource,
// 		type: 1,
// 		uid: inviterId,
// 	}
// 	InviteNewUserInfo(form).then((res) => {
// 		console.log(res, '返回体')
// 	})
// }

//前往活动
function RouterClick(item) {
	console.log(item, 'goToActivitygoToActivitygoToActivity')
	// window.location.href = `${location.origin + `/FifthAnniversaryActivities/` + `?QFLL=true`}`
	window.location.href = item

	// router.push('/')
	// console.log(`${location.origin + `/FifthAnniversaryActivities` + `?inviterId=${inviterId}` + `&lang=${lang}`}`)
}
//获取短信验证码
function msgVerifyCode(type) {
	if (errorMsg.value != '') {
		Toast('請確認號碼是否正確')

		return
	}
	if (!password.value) {
		Toast('請輸入圖形驗證碼')
		return
	}
	if (times.value != 60 && type == 1) {
		return
	}

	getMsgVerifyCode(type)
}
//显示倒计时
function setTimer() {
	//显示倒计时
	let timer = setInterval(() => {
		times.value--
		codeText.value = `${times.value}s`
		if (times.value == 0) {
			clearInterval(timer)
			times.value = 60
			codeText.value = '發送驗證碼'
			getCaptcheCode(1)
		}
	}, 1000)
}
//获取短信验证码
function getMsgVerifyCode(type) {
	let form = {
		phoneNumber: tel_sum.value,
		verifyCode: type == 1 ? '' : code.value,
		keycode: type == 1 ? keyCode.value : '',
		captchecode: password.value,
		action: type == 1 ? 'sendCode' : 'checkCode', //执行动作
		// "nationCode":"86",//区号
		isVerify: false,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	}
	MsgVerifyCode(form)
		.then((res) => {
			if (res.data.result == 1) {
				if (type == 1) {
					codeText.value = '59s'
					times.value = 59
					setTimer()
				}
				if (type == 2) {
					// 注册成功弹窗
					// trueTips.value = true
					jybregister()
					getPoints({ pageName: 'Inviteeregister_index' })
				}
			} else {
				Toast('圖形驗證碼或验证码错误')
				getCap(1)
			}
			// console.log(res)
		})
		.catch((err) => {
			return err
		})
}

function jybregister() {
	//注册
	let form = {
		userName: tel_sum.value,
		password: newKey.value,
		source: 'APP',
		type: 'mobile',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	}
	SendMsgAfter(form)
		.then((res) => {
			// console.log(res.data)
			if (res.status == 200) {
				trueTips.value = true
				UserId()
				// console.log(res.data)
				// this.showAlert = true
				// this.getUserId()
				// Toast(res.data.msg)
			} else {
				Toast('注册失败')
			}
		})
		.catch((err) => {
			console.log(err)
			return err
		})
}

//注册
function register() {
	if (!isLogin.value) {
		console.log(1)
		Toast('請勾選用戶協議，隱私政策協議')
		return false
	}
	if (tel_sum.value && password.value && code.value) {
		msgVerifyCode(2)
	} else {
		Toast('請填寫完整信息')
	}
}
//协议勾选
function protocolCheck() {
	isLogin.value != isLogin.value
	console.log(isLogin.value)
}
//号码选择
function clickfun(val) {
	console.log('选择的号码开头:', val.target.innerHTML)
	// console.log('选择的号码:', val)
	areaCode.value = val.target.innerHTML
	show.value = !show.value
	if (val.target.innerHTML == '+86') {
		Telmaxlength.value = 11
	} else {
		Telmaxlength.value = 8
	}
	tel_sum.value = ''
	event.stopPropagation()
}
//取消验证显示
function telFocus() {
	errorMsg.value = ''
	show.value = false
}
//号码选择现形
function changeArea() {
	show.value = !show.value
	// this.telBlur();
	tel_sum.value = ''
}

//号码验证
function telBlur() {
	if (areaCode.value == '+86') {
		;(!/^1(3|4|5|6|7|8|9)\d{9}$/.test(tel_sum.value) && ((errorMsg.value = '手機號碼格式錯誤'), true)) || (errorMsg.value = '')
		mobileExist()
	} else {
		;(!/^(5|6|8|9)\d{7}$/.test(tel_sum.value) && ((errorMsg.value = '手機號碼格式錯誤'), true)) || (errorMsg.value = '')
		mobileExist()
	}
}
//手机是否注册过
function mobileExist() {
	let form = {
		userName: tel_sum.value,
		type: 'mobile',
	}
	Registration(form)
		.then((res) => {
			if (res.data.result == 1) {
				errorMsg.value = '該號碼已註冊'
				trueTips3.value = true
			} else {
				// this.errorMsg=""
			}
		})
		.catch((err) => {
			console.log(err)
		})
}
//获取图形验证码
function getCap(type) {
	let form = {
		requestType: type,
		keycode: keyCode.value,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	}
	getCaptcheCode(form).then((res) => {
		if (res.data.result == 1) {
			let num = new Date().getTime()
			codeUrl.value = res.data.msg + `&time=${num}`
		}
	})
}
const store = useUsersStore()
// let sesstionis = `"${sesstion}"`
onMounted(async () => {
	console.log(uid)
	getInviterInfo()
	await store.setSource() //根据ip判断国内
	console.log('渠道来源 (0: 大陆 1: 香港)', store.getSource)
	console.log(window.location.href)
	getPoints({ pageName: 'Inviteebrowse_index' })
	WXShare(
		`您收到一份來自好友的助力邀請`,
		`我正在捷利交易宝参与928周年活动，请来助我一臂之力！`,
		`${window.origin}/FifthAnniversaryActivities/register` + `?uid=${store.getUid}` + `&lang=${lang}` + `&sesstion=${store.getSession}`,
		`${window.origin}/FifthAnniversaryActivities/static/928.png`
	)
	//画图
	// html2canvas(document.querySelector('.app'), {
	// 	useCORS: true,
	// 	backgroundColor: '#308EFF',
	// 	width: document.querySelector('.app').clientWidth,
	// 	height: document.querySelector('.app').clientHeight,
	// 	// windowWidth: document.body.scrollWidth,
	// 	// windowHeight: document.body.scrollHeight,
	// 	x: 0,
	// 	y: window.pageYOffset,
	// }).then((canvas) => {
	// 	console.log(canvas, '222')
	// 	let url = canvas.toDataURL('image/png')
	// 	console.log(url)
	// 	// let url = canvas.toDataURL('image/png')
	// 	// data.shareImg = url
	// 	// AppInterfaceCommon.clickShare(data)
	// })

	// setTimer()
	keyCode.value = new Date().getTime()
	newKey.value = /"/ + new Date().getTime() + /"/

	console.log(keyCode.value, '随机数=================')
	getCap(1)
	console.log(uid, '获取uid')
	//获取用户地区

	queryArea().then((res) => {
		console.log(res)
		res.data.data == 'CN' ? (areaCode.value = '+86') : (areaCode.value = '+852')
		res.data.data == 'CN' ? (Telmaxlength.value = 11) : (Telmaxlength.value = 8)
		console.log(lang, '2')
	})
})
console.log(window.screen.height, 'window.screen.height----------window.screen.height')
// document.getElementsByClassName('loginProtocol').classList.add('UserXieyi')
var userXieYi = document.getElementsByClassName('loginProtocol')
// userXieYi.style.setProperty(top, window.screen.height + 'px')
</script>

<style scoped lang="scss">
.backgroundImg {
	background-image: url(@img/doTasks/register.png);
	background-size: 100%;
	width: 10rem;
	height: 390px;
}
.tradegoLogo {
	background-image: url(@img/doTasks/titleLogo.png);
	background-size: 100%;
	width: 375px;
	height: 220px;
	position: relative;
	// top: 30px;
	left: 50%;
	transform: translateX(-50%);
}
.yearCenter {
	position: relative;
	top: 38px;
	left: 50%;
	transform: translateX(-50%);
	height: 73px;
	font-size: 55px;
	font-family: MiSans-Bold, MiSans;
	font-weight: bold;
	line-height: 64px;
	// text-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25), 0px 1px 0px #c50000;
	-webkit-text-stroke: 1px #c50000;
	background: linear-gradient(93deg, #fdf7e0 0%, #fdf9e7 63%, #fdfbeb 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	text-align: center;
}
.lastContent {
	border-radius: 5px;
	width: 235px;
	height: 30px;
	background: #ff1f1f;
	margin-top: 40px;
	position: relative;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 18px;
	font-family: MiSans-Medium, MiSans;
	font-weight: bold;
	color: #fefae8;
	line-height: 21px;
	text-shadow: 0px 1px 0px #c50000;
}
.verifyDiv {
	width: 375px;
	height: calc(100vh - 210px);
	position: relative;
	z-index: 111;
	margin-top: -179px;
	background: #ffffff;
	box-shadow: 0px 18px 38px 0px rgba(166, 100, 2, 0.1);
	border-radius: 20px 20px 0px 0px;
	display: flex;
	align-content: space-between;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;

	.userId {
		padding-top: 32px;
		padding-left: 5px;
		display: flex;
		align-items: center;
		.userImg {
			width: 40px;
			height: 40px;
			border-radius: 22px 22px 22px 22px;
			opacity: 1;
			border: 1px solid #f2f9fb;
		}
		.userName {
			padding-left: 8px;
			font-size: 16px;
			font-family: MiSans-Medium, MiSans;
			font-weight: bold;
			color: #333333;
			line-height: 22px;
			word-break: break-all;
			max-width: 265px;
		}
		.reportName {
			padding-left: 8px;
			font-size: 16px;
			font-family: MiSans-Medium, MiSans;
			font-weight: bold;
			color: #333333;
			line-height: 22px;
		}
	}
}

//复制输入框style文件
.input_oh {
	background-color: #f4f8fb;
	margin: 46px auto 0;
	max-width: 8rem;
	border-radius: 5px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.input_oh .van-cell {
	background-color: #f4f8fb;
	border-radius: 5px;
	width: 78%;
	display: inline-block;
	padding: 0.4rem 0.1rem;
}

.areaCode {
	flex: 1;
	font-size: 0.3733rem;
	font-family: PingFang SC;
	font-weight: 500;
	color: #000000;
	line-height: 1.19rem;
	text-align: center;
	background: #f4f8fb;
	border-radius: 5px;
	vertical-align: middle;
	position: relative;
	width: 1.5rem;
	display: inline-block;
}

.areaList {
	position: absolute;
	bottom: -1.6rem;
	left: 14px;
	width: 100%;
	height: 1.8rem;
	background: #f4f8fb;
	z-index: 3;
	border: 1px solid #f4f8fb;
	text-align: left;
	padding-left: 0.2rem;
	border-radius: 5%;
}

.areaList p {
	line-height: 0.8rem;
}

.areaList :first-child {
	border-bottom: 1px solid #f4f8fb;
}

.areaCode b {
	display: inline-block;
	width: 0;
	height: 0;
	border-right: 0.11rem solid transparent;
	border-left: 0.11rem solid transparent;
	border-top: 0.2rem solid #009bff;
	margin-left: 0.1rem;
}

.input_pass {
	margin: 0.5rem auto 0;
	max-width: 8rem;
	display: flex;
	justify-content: left;
	align-items: center;
}

.input_pass .van-cell {
	background-color: #f4f8fb;
	border-radius: 5px;
	max-width: 5rem;
	display: inline-block;
	padding: 0.4rem 0.5rem;
	height: 47.19px;
}

.codeImg {
	order: 1;
	width: 2.8rem;
	margin-left: 0.2rem;
	border-radius: 5px;
	text-align: center;
	background: #e1e1e1;
	height: 47.19px;
	display: flex;
	justify-content: center;
	align-items: center;
	.button {
		width: 96px;
		height: 38px;
		background: #ffffff;
		border-radius: 5px 5px 5px 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		span {
			font-size: 14px;
			font-family: MiSans-Medium, MiSans;
			color: #308fff;
			line-height: 20px;
		}
	}
}
.telCodeBtn {
	order: 1;
	width: 3rem;
	text-align: center;
	background: #f4f8fb;
	height: 47.19px;
	display: flex;
	justify-content: center;
	align-items: center;
	.button {
		width: 96px;
		height: 38px;
		background: #ffffff;
		border-radius: 5px 5px 5px 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		span {
			font-size: 14px;
			font-family: MiSans-Medium, MiSans;
			color: #308fff;
			line-height: 20px;
		}
	}
}

.telCodeBtn {
	color: #009bff;
	font-size: 0.35rem;
}

.loginProtocol {
	display: flex;
	align-items: center;
	// margin-top: 176px;
	justify-content: center;
	margin-bottom: 20px;
}

.loginProtocol span {
	margin-left: 0.1rem;
	font-size: 0.3rem;
	margin-top: 0.15rem;
}

.van-checkbox {
	display: inline-block;
	// height: 0.5rem;
}

.van-checkbox__icon {
	-webkit-box-flex: 0;
	flex: none;
	height: 0.4rem;
	font-size: 0.4rem;
	line-height: 0.4rem;
}

.protocolText a {
	color: #008aff;
}

.registered {
	width: 311px;
	height: 48px;
	background: #308fff;
	border-radius: 100px 100px 100px 100px;
	color: #fff;
	margin: 32px auto 0;
	text-align: center;
	// border-radius: 5px;
	font-size: 0.4rem;
	display: flex;
	justify-content: center;
	align-items: center;
	// box-shadow: 0.1rem 0.2rem 0.2rem 0.1rem rgb(0 143 237 / 32%);
}

.wrapper .alert {
	width: 7.2rem;
	height: 9.1733rem;
	background-image: url('img/ARWebsite/popup_chs.png');
	background-repeat: no-repeat;
	background-size: 100%;
}

.wrapper .alertt {
	width: 7.2rem;
	height: 9.1733rem;
	background-image: url('img/ARWebsite/popup_cht.png');
	background-repeat: no-repeat;
	background-size: 100%;
}

.wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.witBtn {
	width: 5rem;
	height: 6.5rem;
}

.witBtns {
	width: 5rem;
	height: 7.7rem;
}

.btn {
	width: 5rem;
	height: 1.2rem;
	margin: 0 auto;
	background: #306fff;
	border-radius: 0.6rem;

	font-size: 0.3533rem;
	font-family: MiSans;
	color: #fff;
	text-align: center;
	line-height: 1.2rem;
}

.btn2 {
	margin: 0 auto;
	width: 5rem;
	height: 1rem;
	margin-top: 0.2rem;
}

.wrapper .close {
	margin-top: 2rem;
	text-align: center;
}

.wrapper .close img {
	width: 0.8rem;
	height: 0.8rem;
}
.app {
	// height: 21.5rem;
}
.pop_1 {
	width: 343px;
	height: 350px;
}
:deep(.van-toast--text) {
	white-space: nowrap;

	.van-toast__text {
		white-space: nowrap;
	}
}
</style>
<style lang="scss">
.van-checkbox__icon .van-icon {
	// width: 12px;
	// height: 12px;
	border: 1px solid #008aff;
	margin-top: 2px;
}
.van-icon-success:before {
	content: '\e728';
	display: flex;
	align-items: center;
	justify-content: center;
	// margin-top: -5px;
}
.closeImg4 {
	// width: 40px;
	// height: 40px;
	// position: fixed;
	// z-index: 2101;
	// top: 80%;
	// left: 50%;
	// transform: translateX(-50%);
	width: 1.066667rem;
	height: 1.066667rem;
	position: absolute;
	z-index: 2000;
	top: 2%;
	left: 92.3%;
	transform: translateX(-50%);
}
.pop_1 {
	display: flex;
	flex-direction: column;
	align-items: center;
	.head_1 {
		background-image: url('@img/thanks.png');
		background-size: 100%;
		width: 96px;
		height: 96px;
		margin-top: 32px;
	}
	.head_2 {
		background-image: url('@img/successIcon.png');
		background-size: 100%;
		width: 96px;
		height: 96px;
		margin-top: 32px;
	}
	.thanks_content_1 {
		font-size: 24px;
		font-family: MiSans-Demibold, MiSans;
		font-weight: bold;
		color: #333333;
		margin-top: 16px;
	}
	.thanks_content_2 {
		font-size: 14px;
		font-family: MiSans-Regular, MiSans;
		font-weight: 400;
		color: #666666;
		margin-top: 16px;
		text-align: center;
		.thanks_content_s {
			margin-top: 12px;
		}
	}
	.inviteButton {
		background-image: url(@img/inviteImg.png);
		background-size: 100%;
		width: 237px;
		height: 40px;
		margin-top: 24px;
	}
	.inviteButton2 {
		background-image: url(@img/inviteSuccess.png);
		background-size: 100%;
		width: 237px;
		height: 40px;
		margin-top: 24px;
		animation: loading 0.3s ease 0s infinite alternate;
	}
}
</style>
<style lang="scss">
.app {
	.popupSty {
		// position: fixed;
		border-radius: 20px;
	}
}
.van-toast__text {
	white-space: nowrap;
}
</style>
