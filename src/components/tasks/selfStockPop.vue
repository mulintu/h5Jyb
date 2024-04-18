<template>
	<van-popup v-model:show="inenShow" round position="bottom" :style="{ maxHeight: '90%' }" @close="closePop">
		<div class="popWrap">
			<div class="title">添加股票到自選股</div>
			<div class="subTitle">*獲得抽獎次數僅限於在本活動畫面添加，超出不計入抽獎次數</div>
			<div class="list">
				<van-checkbox-group v-model="seleStockjoined" icon-size="14px">
					<div v-for="(item, index) in selfStockList" :key="item" class="listItem">
						<van-checkbox :name="item.code" :disabled="joined.indexOf(item.code) >= 0" shape="square" @click="checkboxClick">
							<div class="code">{{ item.code }}</div>
							<div class="name">{{ item.stockName }}</div>
							<van-button class="joinBtn" :disabled="joined.indexOf(item.code) >= 0" :loading="item.loading" @click.stop="join(item, index)">{{
								joined.indexOf(item.code) >= 0 ? '已加入' : '加入自選'
							}}</van-button>
						</van-checkbox>
					</div>
				</van-checkbox-group>
			</div>
			<van-button class="batchJoinBtn" :disabled="isCompleted" :loading="batchJoinLoad" @click="batchJoin()"
				>{{ isCompleted ? '任務已完成' : '批量加入' }}
			</van-button>
		</div>
	</van-popup>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
const router = useRouter()
let selfStockC = ref(0)
const props = defineProps({
	// 弹窗状态
	popState: {
		type: Boolean,
		default() {
			return false
		},
	},
	// 自选股列表
	selfStockList: {
		type: Array,
		default() {
			return []
		},
	},
	// 任务是否完成
	isCompleted: {
		type: Boolean,
		default() {
			return false
		},
	},
	// 已添加的自选股
	joined: {
		type: Array,
		default() {
			return []
		},
	},
	lengthCheck: {
		type: Number,
		default() {
			return []
		},
	},
	// 批量加入loading
	batchJoinLoad: {
		type: Boolean,
		default() {
			return false
		},
	},
})
const seleStockjoined = ref([])
let inenShow = ref(false)
watch(
	() => props.popState,
	(newVal, oldVal) => {
		inenShow.value = newVal
	}
)
watch(
	() => props.joined,
	(newVal, oldVal) => {
		seleStockjoined.value = newVal
	},
	{ immediate: true }
)

watch(
	() => props.lengthCheck,
	(newVal, oldVal) => {
		selfStockC.value = newVal
	},
	{ immediate: true }
)
const emits = defineEmits(['close', 'triggerJoin', 'triggerBatchJoin'])
// 关闭弹窗
function closePop() {
	emits('close')
}
// 加入自选股
function join(item, index) {
	emits('triggerJoin', item, index)
	if (seleStockjoined.value.length > 1) {
		seleStockjoined.value = []
	}
}
// 批量加入
function batchJoin() {
	let batchJoinArr = seleStockjoined.value.filter((i) => props.joined.indexOf(i) == -1)
	emits('triggerBatchJoin', batchJoinArr)
	seleStockjoined.value = []
}
// let tempNum = 0
function checkboxClick() {
	if (seleStockjoined.value.length + selfStockC.value > 10) {
		Toast('此任务最多可获得10次抽奖机会，您已选中10条记录')
	}
	// tempNum = seleStockjoined.value.length + selfStockC.value
}
</script>

<style scoped lang="scss">
.popWrap {
	height: 600px;
	.title {
		font-size: 24px;
		font-weight: bold;
		color: #323233;
		line-height: 28px;
		padding: 40px 0 4px;
		position: relative;
		text-align: center;
		&::before {
			content: '';
			position: absolute;
			width: 40px;
			height: 4px;
			background: #e1e4e6;
			border-radius: 20px;
			top: 16px;
			left: 50%;
			transform: translateX(-50%);
		}
	}
	.subTitle {
		font-size: 12px;
		color: #a6a9b6;
		line-height: 16px;
		text-align: center;
		padding-bottom: 6px;
	}
	.list {
		padding: 0 30px;
		height: calc(100% - 200px);
		overflow: auto;
		.listItem {
			font-size: 14px;

			line-height: 20px;
			padding: 10px 0 10px;
			.code {
				width: 100px;
				line-height: 1.3;
				padding-left: 10px;
				color: #333333;
			}
			.name {
				width: 100px;
				line-height: 1.3;
				color: #333333;
			}
			:deep(.van-checkbox__label) {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			:deep(.van-checkbox--disabled .van-checkbox__icon--checked .van-icon) {
				color: #c8c9cc;
			}
			:deep(.van-checkbox__icon--checked .van-icon) {
				border-radius: 2px;
				border-color: #434344 !important;
				background: #fff !important;
				color: #ee0a24;
			}
			:deep(.van-checkbox__icon .van-icon) {
				border-radius: 2px;
				border-color: #434344 !important;
			}
		}
	}
	.joinBtn {
		width: 64px;
		height: 20px;
		border-radius: 40px;
		border: 1px solid #fe3d48;
		text-align: center;
		line-height: 20px;
		color: #fe3d48;
		font-size: 12px;
		padding: 0;
		:deep(.van-button__content) {
			height: 20px;
		}
		&.van-button--disabled {
			color: #a6a9b6;
			border-color: #a6a9b6;
		}
	}
	.batchJoinBtn {
		width: 311px;
		height: 48px;
		background: #fe3d48;
		border-radius: 100px;
		text-align: center;
		font-size: 16px;
		font-weight: bold;
		color: #ffffff;
		margin: 6px auto;
		display: block;
		:deep(.van-button__content) {
			height: 48px;
		}
	}
}
</style>
