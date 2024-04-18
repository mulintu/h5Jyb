<template>
	<van-overlay :show="ruleShow">
		<div class="ruleWrapper" @click.stop>
			<div class="prizeBg">
				<div class="title">{{ prizeTitle }}</div>
				<img :src="prizeImg" />
				<div class="prizeName">{{ prizeName }}</div>
				<div>
					<div v-if="isWin">請到<span @click="goPrizeRecord">「抽獎記錄」</span>查看</div>
					<div v-else>下次一定行！</div>
				</div>
				<div class="btnBox">
					<div v-if="type && isWin" class="btn downloadBtn" @click="download"></div>
					<div class="btn" @click.stop="closePop"></div>
				</div>
			</div>
			<div class="close" @click.stop="closePop"></div>
		</div>
	</van-overlay>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { type } from '@js/msg'
import { useRouter } from 'vue-router'
const props = defineProps({
	// 弹窗状态
	popState: {
		type: Boolean,
		default() {
			return false
		},
	},
	// 中奖等级
	prizeLevel: {
		type: [String, Number],
		default() {
			return ''
		},
	},
	// 奖品图片
	prizeImg: {
		type: String,
		default() {
			return ''
		},
	},
	// 奖品名称
	prizeName: {
		type: String,
		default() {
			return '港股LV2港股内地版全终端行情 1 个月'
		},
	},
	// 是否中奖
	isWin: {
		type: Boolean,
		default() {
			return false
		},
	},
})
const prizeTitle = computed(() => (props.isWin ? '恭喜您獲得' : '很遺憾您未獲得奖品'))

const router = useRouter()
let ruleShow = ref(false)
watch(
	() => props.popState,
	(newVal, oldVal) => {
		ruleShow.value = newVal
	}
)
const emits = defineEmits(['close', 'prizeRecord'])
function closePop() {
	emits('close')
}
function download() {
	router.push('/downLoad')
}
function goPrizeRecord() {
	emits('prizeRecord')
}
</script>

<style scoped lang="scss">
.ruleWrapper {
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	.prizeBg {
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
			height: 28px;
			font-size: 24px;
			font-weight: bold;
			color: #323233;
			line-height: 28px;
			margin: 40px 0 24px;
		}
		img {
			width: 172px;
			height: 110px;
			vertical-align: middle;
		}
		.prizeName {
			font-size: 14px;
			font-weight: bold;
			color: #fb2f22;
			line-height: 19px;
			margin: 23px 0 10px;
		}
		.btnBox {
			display: flex;
			justify-content: center;
			margin-top: 12px;
		}
		.btn {
			width: 160px;
			height: 70px;
			background: url('@img/prize/continue.png') center/100% no-repeat;
			// margin: auto;
		}
		.downloadBtn {
			background-image: url('@img/prize/download.png');
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
