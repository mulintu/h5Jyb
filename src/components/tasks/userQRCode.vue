<template>
	<div id="app">
		<van-popup v-model:show="inenShow" :close-on-click-overlay="false" :style="{ maxHeight: '90%' }" class="popupSty3" @close="closePop">
			<div class="invice">
				<div class="qrcode">
					<div id="qrcodeImg"></div>
				</div>
			</div>
			<img v-if="inenShow" class="closeImg4" src="@img/close.png" @click="inenShow = false" />
		</van-popup>

		<div ref="imageWrapper2" class="invice" style="position: absolute; z-index: -10000; top: 0">
			<div class="qrcode">
				<div id="qrcodeImg2"></div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import QRCode from 'qrcodejs2-fix'
import { useUsersStore } from '@/store/user'
import { lang, uid, type } from '@js/msg'
import html2canvas from 'html2canvas'
import AppInterfaceCommon from '@js/AppInterfaceCommon'
import AppInterface from '@js/AppInterfaceCommon'
import WXShare from '@js/wxshare'

const store = useUsersStore()
const imageWrapper2 = ref(null)
const props = defineProps({
	// 弹窗状态
	popState: {
		type: Boolean,
		default() {
			return false
		},
	},
})
let inenShow = ref(false)
const emits = defineEmits(['close', 'triggerFocus', 'triggerAllFocus', 'triggerView'])
const imgData = ref('')

function closePop() {
	emits('close')
}
function makeQrCode2() {
	// console.log('rere')
	document.getElementById('qrcodeImg2').innerHTML = ''
	var fontS = getComputedStyle(window.document.documentElement)['font-size'] || 20
	var qrcode = new QRCode(document.getElementById('qrcodeImg2'), {
		width: 4.7 * parseInt(fontS),
		height: 4.7 * parseInt(fontS),
		// width: 77 * 1,
		// height: 77 * 1,
		colorDark: '#000000',
		colorLight: '#ffffff',
		correctLevel: QRCode.CorrectLevel.H,
	})
	const url = `${location.origin + `/FifthAnniversaryActivities/register` + `?uid=${store.getUid}` + `&lang=${lang}`}`
	// console.log(url)
	qrcode.clear()
	qrcode.makeCode(url)
	// getInviterInfo()
}

function makeQrCode() {
	// console.log('rere')
	document.getElementById('qrcodeImg').innerHTML = ''
	var fontS = getComputedStyle(window.document.documentElement)['font-size'] || 20
	var qrcode = new QRCode(document.getElementById('qrcodeImg'), {
		width: 4.8 * parseInt(fontS),
		height: 4.7 * parseInt(fontS),
		// width: 77 * 1,
		// height: 77 * 1,
		colorDark: '#000000',
		colorLight: '#ffffff',
		correctLevel: QRCode.CorrectLevel.H,
	})
	const url = `${location.origin + `/FifthAnniversaryActivities/register` + `?uid=${store.getUid}` + `&lang=${lang}`}`
	// console.log(url)
	qrcode.clear()
	qrcode.makeCode(url)
	// getInviterInfo()
}

async function shareImg() {
	await nextTick(() => {
		html2canvas(imageWrapper2.value, {
			useCORS: true,
			async: true,
			scale: window.devicePixelRatio,
		}).then((canvas) => {
			console.log(imgData.value)
			imgData.value = canvas.toDataURL('image/png')
			sessionStorage.setItem('bgImg', imgData.value)
			// emit('setInvitImg', imgData.value)
			// console.log(imgData.value, 'imgData.valueimgData.valueimgData.valueimage/png')
		})
	})
}

function shareInfo() {
	const data = {
		title: '您收到一份來自好友的助力邀請',
		desc: '我正在捷利交易宝参与928周年活动，请来助我一臂之力！',
		thumb_img_url: imgData.value,
		url: `${location.origin + `/FifthAnniversaryActivities/register` + `?uid=${store.getUid}` + `&lang=${lang}` + `&sesstion=${store.getSession}`}`,
		shareImg: imgData.value, //分享到交易圈没参数默认APP会截图分享
		type: 10, //分享到交易圈类型
		shareTrading: true, //是否显示交易圈按钮
		shareImgType: 1, //1Base64,0链接Url
	}
	// console.log(data, '------------')
	AppInterface.clickShare(data)
}
watch(
	() => props.popState,
	(newVal, oldVal) => {
		inenShow.value = newVal
		if (inenShow.value == true) {
			setTimeout(() => {
				makeQrCode()
				if (store.uid) {
					shareInfo()
				}
			}, 1)
		}
	}
)
onMounted(() => {
	shareImg()
	makeQrCode2()
	// WXShare(
	// 	`您收到一份來自好友的助力邀請`,
	// 	`我正在捷利交易宝参与928周年活动，请来助我一臂之力！`,
	// 	`${window.origin}//FifthAnniversaryActivities/register` + `?uid=${store.getUid}` + `&lang=${lang}` + `&sesstion=${store.getSession}`,
	// 	`${window.origin}/FifthAnniversaryActivities/static/928.png`
	// )
})
</script>
<style lang="scss" scoped>
.invice {
	background-image: url('@img/doTasks/inviteImg.png');
	width: 9.5rem;
	height: 16.8rem;
	background-size: 100%;
}
.qrcode {
	// width: calc(80.5px * 1);
	// height: calc(80.5px * 1);
	width: calc(173px * 1);
	height: calc(160px * 1);
	background-color: #fff;
	border-radius: 3px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	top: 50%;
	left: 50%;
	transform: translateX(-50%);
	#qrcodeImg {
		width: 4.5rem;
		height: 4.5rem;

		img {
			width: 4.5rem;
			height: 4.5rem;
		}
	}
}
.closeImg4 {
	width: 40px;
	height: 40px;
	position: fixed;
	z-index: 2101;
	top: 1%;
	left: 93%;
	transform: translateX(-50%);
	opacity: 0.7;
}
</style>
<style lang="scss" scoped>
:deep(.popupSty3) {
	border-radius: 20px;
}
</style>
