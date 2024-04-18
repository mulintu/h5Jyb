<template>
	<van-overlay :show="couponShow">
		<div class="couponWrapper" @click.stop>
			<div class="couponBg">
				<div class="title">領取成功</div>
				<div class="couponItem">
					<div class="denomination">{{ couponValue.value }}</div>
					<div class="couponDes">
						<div class="condition">滿{{ couponValue.reach }}元可用</div>
						<div class="des">數量有限 領完即止</div>
					</div>
					<div class="couponType">行情優惠券</div>
				</div>
				<div class="useBtn" @click="toMyCoupon">去使用</div>
				<div class="viewCoupon" @click="toMyCoupon">查看我的優惠券 ＞</div>
			</div>
			<div class="close" @click.stop="closePop"></div>
		</div>
	</van-overlay>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppInterfaceCommon from '@js/AppInterfaceCommon'
import { isUat } from '@js/Utils'
import { type } from '@js/msg'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
	// 弹窗状态
	popState: {
		type: Boolean,
		default() {
			return false
		},
	},
	couponValue: {
		type: Object,
		default() {
			return {}
		},
	},
})
let couponShow = ref(false)
watch(
	() => props.popState,
	(newVal, oldVal) => {
		couponShow.value = newVal
	}
)
const emits = defineEmits(['close'])
function closePop() {
	emits('close')
}
function toMyCoupon() {
	if (type) {
		router.push('/downLoad')
	} else {
		AppInterfaceCommon.jumpOtherWeb({
			url: `http${isUat ? '' : 's'}://cloudh5${isUat ? 'uat' : ''}.iqdii.com/MyCoupons/index.html`,
			type: '3',
			needLogin: true,
		})
	}
}
defineExpose({
	toMyCoupon,
})
</script>

<style scoped lang="scss">
.couponWrapper {
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	.couponBg {
		width: 335px;
		height: 360px;
		background: linear-gradient(180deg, #fffefa 0%, #fff5d4 100%);
		box-shadow: 0px 18px 38px 0px rgba(166, 100, 2, 0.1);
		border-radius: 15px 15px 15px 15px;
		border: 1px solid #ffd4b0;
		margin: auto;
		position: relative;
		text-align: center;
		font-size: 14px;
		color: #7e6361;
		line-height: 16px;
		.title {
			font-size: 24px;
			font-weight: bold;
			color: #323233;
			line-height: 28px;
			margin: 40px 0 30px;
		}
		.couponItem {
			margin: auto;
			width: 235px;
			height: 125px;
			background: #ffffff linear-gradient(227deg, #ffd092 0%, #ffe0c2 100%);
			box-shadow: 0px 17px 36px 0px rgba(166, 100, 2, 0.1);
			border-radius: 15px;
			border: 1px solid #ffd3ae;
			position: relative;
			display: flex;
			padding: 13px 0;
			text-align: center;
			.couponType {
				position: absolute;
				top: -1px;
				left: -1px;
				width: 92px;
				height: 25px;
				background: linear-gradient(270deg, #ffb750 0%, #f2a452 100%);
				border-radius: 15px 0px 13px 0px;
				font-size: 13px;
				font-weight: bold;
				color: #ffffff;
				line-height: 25px;
			}
			.denomination {
				width: 43%;
				font-size: 60px;
				font-weight: bold;
				line-height: 110px;
				background: linear-gradient(180deg, #ff4949 0%, #e50236 100%);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				border-right: 1px dashed #f83644;
				margin-top: -2px;
				overflow: hidden;
			}
			.couponDes {
				width: 57%;
				text-align: left;
				padding-left: 11px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.condition {
					font-size: 18px;
					font-weight: bold;
					color: #323233;
					line-height: 24px;
					margin: 5px 0 11px;
				}
				.des {
					font-size: 12px;
					color: #5f3f51;
					line-height: 16px;
				}
			}
		}
		.useBtn {
			width: 225px;
			height: 48px;
			line-height: 50px;
			background: linear-gradient(270deg, #fd3915 0%, #ff4d77 100%);
			box-shadow: inset 0px 10px 17px 0px rgba(255, 255, 255, 0.5), 0px 4px 5px 0px rgba(255, 91, 91, 0.25),
				inset 0px 4px 8px 0px rgba(211, 0, 0, 0.5);
			border-radius: 64px;
			font-size: 18px;
			font-weight: bold;
			color: #ffebdb;
			text-align: center;
			margin: 31px auto 24px;
		}
		.viewCoupon {
			font-size: 12px;
			color: #5f3f51;
		}
	}
}
.close {
	width: 40px;
	height: 40px;
	background: url('@img/close.png') center/100% 100% no-repeat;
	margin: 24px auto 0;
}
</style>
