<template>
	<van-overlay :show="ruleShow">
		<div class="ruleWrapper" @click.stop>
			<div class="ruleBg">
				<div class="ruleTitle">{{ ruleTitle }}</div>
				<div class="ruleCont">
					<div v-for="item in ruleMsg" :key="item" class="ruleItem">
						<div v-if="item.headline" class="title">{{ item.headline }}</div>
						<p v-for="pItem in item.pArr" :key="pItem">{{ pItem }}</p>
					</div>
				</div>
			</div>
			<div class="close" @click.stop="closePop"></div>
		</div>
	</van-overlay>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
const props = defineProps({
	// 弹窗状态
	popState: {
		type: Boolean,
		default() {
			return false
		},
	},
	// 规则内容
	ruleMsg: {
		type: Array,
		default() {
			return [
				{
					headline: '', //一级标题
					pArr: '', //内容
				},
			]
		},
	},
	// 规则标题
	ruleTitle: {
		type: String,
		default() {
			return '活动规则'
		},
	},
})
let ruleShow = ref(false)
watch(
	() => props.popState,
	(newVal, oldVal) => {
		ruleShow.value = newVal
	}
)
const emits = defineEmits(['close'])
function closePop() {
	emits('close')
}
</script>

<style scoped lang="scss">
.ruleWrapper {
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	.ruleBg {
		width: 335px;
		height: 400px;
		overflow: auto;
		margin: auto;
		position: relative;

		background: #ffffff;
		box-shadow: 0px 18px 38px 0px rgba(166, 100, 2, 0.1);
		border-radius: 15px;
		.ruleTitle {
			font-size: 24px;
			font-weight: bold;
			color: #323233;
			line-height: 28px;
			padding-top: 35px;
			text-align: center;
		}
		.ruleCont {
			padding: 28px 15px 0;
			.ruleItem {
				margin-bottom: 15px;
			}
			.title {
				font-size: 16px;
				font-weight: bold;
				color: #97143a;
				line-height: 18px;
			}
			p {
				font-size: 13px;
				color: #7e6361;
				line-height: 16px;
			}
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
