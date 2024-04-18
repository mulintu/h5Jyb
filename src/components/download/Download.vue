<template>
	<div v-show="boxState" id="app" class="box">
		<!-- <div class="downWrap">
      <div class="down">
        <div class="title">
          <div class="red"></div>{{ $t("lucky.downloadGuide") }}
        </div>
        <div class="cont">
          <div class="cont1">
            <div>1）{{ $t("lucky.downloadSteps1")[0] }}</div>
            <div class="t_i">{{ $t("lucky.downloadSteps1")[1] }}</div>
          </div>
          <div class="cont2">
            <div>2）{{ $t("lucky.downloadSteps2")[0] }}</div>
            <div class="t_i">{{ $t("lucky.downloadSteps2")[1] }}</div>
            <div class="t_i">{{ $t("lucky.downloadSteps2")[2] }}</div>
          </div>
        </div>
      </div>
    </div> -->
		<a id="iosLink" href="https://itunes.apple.com/cn/app/jiao-yi-bao-tradebook/id716379516?mt=8"></a>
		<a v-if="isSecretary" id="alink" :href="androidURL" target="blank"></a>
		<a v-else id="alink" href="http://www.tradego8.com/android_downloading.html"></a>
	</div>
</template>
<script>
import { toRefs, onMounted, reactive, onBeforeMount } from 'vue'
import { ipVal } from '@js/msg'
export default {
	props: {},
	setup(props, { emit }) {
		const state = reactive({
			isSecretary: null,
			iosURL: 'https://itunes.apple.com/cn/app/jiao-yi-bao-tradebook/id716379516?mt=8',
			androidURL: '',
			bloogerId: null,
			discountCoupon: '',
			MarginReserved: '',
			goodsID: '',
			boxState: false,
			ipVal: ipVal ? ipVal : JSON.parse(sessionStorage.getItem('chinese')),
		})
		onBeforeMount(() => {
			state.isSecretary = Boolean(getQueryString('isSecretary'))
			state.bloogerId = getQueryString('ReferrerID') ? getQueryString('ReferrerID') : ''
			state.discountCoupon = getQueryString('CouponSN') ? getQueryString('CouponSN') : ''
			state.goodsID = getQueryString('goodsSN') ? getQueryString('goodsSN') : ''
			state.MarginReserved = getQueryString('MarginReserved') ? getQueryString('MarginReserved') : ''
			state.androidURL = `tradego://tradego.com/PayAddress=http://pay.iqdii.com/Pay/Home?MarginReserved=${state.MarginReserved}&CouponSN=${state.discountCoupon}&goodsSN=${state.goodsID}&OrderFrom=8&ReferrerID=${state.bloogerId}`
		})
		onMounted(() => {
			//判断机型
			var u = navigator.userAgent,
				app = navigator.appVersion
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //g //这个是安卓操作系统
			var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端 //这个是ios操作系统
			var ua = navigator.userAgent.toLowerCase() //获取判断用的对象
			if (isMobile()) {
				//移动端
				console.log('移动', state.ipVal, isAndroid, isIOS)
				if (state.ipVal == 'other') {
					console.log('海外')
					if (isIOS) {
						//doSomething ios下载地址
						window.location.href = 'https://cloudh5.iqdii.com/operation/HKStore.html'
					}
					if (isAndroid) {
						// alert("进入安卓")
						//doSomething android下载地址
						window.location.href = 'https://play.google.com/store/apps/details?id=com.rongyi.jyb'
					}
				} else if (state.ipVal == 'CN') {
					console.log('海内')
					if (ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/WeiBo/i) == 'weibo') {
						state.boxState = true
						if (isIOS) {
							//doSomething ios下载地址
							window.location.href = 'https://cloudh5.iqdii.com/operation/HKStore.html'
						}
						if (isAndroid) {
							// alert("进入安卓")
							//doSomething android下载地址
							window.location.href = 'https://cloudh5.iqdii.com/operation/index.html'
						}
					} else {
						console.log(isIOS)
						console.log(isAndroid)
						// return false
						if (isIOS) {
							//doSomething ios下载地址
							document.getElementById('iosLink').click()
						}
						if (isAndroid) {
							// alert("进入安卓")
							//doSomething android下载地址
							document.getElementById('alink').click()
						}
						state.boxState = false
					}
				} else {
					console.log('err')
				}
			} else {
				console.log('PC')
				window.location.href = 'http://tradego8.com/business.aspx'
			}
		})
		const getQueryString = (name) => {
			return decodeURIComponent((new RegExp(`[?|&]${name}=` + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
		}
		const isMobile = () => {
			let flag = navigator.userAgent.match(
				/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
			)
			return flag
		}
		return {
			...toRefs(state),
			getQueryString,
			isMobile,
		}
	},
}
</script>
<style scoped>
.downWrap {
	height: 100%;
	background: #faf2ec;
	padding: 0.346667rem;
	box-sizing: border-box;
	margin: 0 auto;
	max-width: 10rem;
}
.down {
	background: #ffffff;
	border-radius: 0.106667rem;
	height: 100%;
	padding-top: 47px;
	box-sizing: border-box;
	/* background-image: url('../../assets/img/sweepstakes/down1.png'),
    url('../../assets/img/sweepstakes/down2.png'); */
	background-position: center -2.72rem;
	background-size: 107%;
}
.title {
	font-size: 32px;
	font-weight: 500;
	color: #333333;
}
.red {
	height: 0.35rem;
	margin-right: 0.3rem;
	display: inline-block;
	border-left: 0.15rem solid #ee4034;
}
.cont {
	padding: 60px 58px 0;
	font-size: 28px;
	font-weight: 400;
	color: #666666;
	line-height: 40px;
}
.t_i {
	text-indent: 1.5em;
}
.cont1 {
	margin-bottom: 387px;
}
</style>
