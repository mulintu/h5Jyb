<template>
	<van-popup v-model:show="inenShow" round position="bottom" :style="{ maxHeight: '90%' }" @close="closePop">
		<div class="popWrap">
			<div class="title">關注官方認證{{ inenTitle }}</div>
			<div :class="['inen', `inen${inenType}`]">
				<div v-for="item in inenList" :key="item" class="inenItem" @click="view(item)">
					<div class="inenLeft">
						<!-- {{  }} -->
						<img v-if="item.logo ? item.logo.includes('http') : ''" :src="item.logo" class="inenIogo" @error="setDefaultImage" />
						<img v-else :src="tbac.tbac + item.logo" class="inenIogo" @error="setDefaultImage" />

						<div v-if="inenType == 1" class="code">{{ item.code }}</div>
						<img v-else :src="enterIcon" class="enterIcon" />
					</div>
					<div class="inenCenter">
						<div class="name">{{ item.name }}</div>
						<div class="enName">{{ inenType == 1 ? item.enName : item.intro }}</div>
						<div v-if="inenType == 1" class="sign">
							<img :src="iconV" /> <span>{{ item.name }}官方帳號</span>
						</div>
					</div>
					<!-- <van-button class="focusBtn" :disabled="item.isFocus" :loading="item.loading" @click="focus(item, index)">{{
						item.isFocus ? '已關注' : '關注'
					}}</van-button> -->
					<van-button v-if="!item.isFocus" class="focusBtn" :loading="item.loading" @click="focus(item, index)">關注</van-button>
					<van-button v-else class="focusBtn" :loading="item.loading" @click="gotoview(item, index)">前往查看</van-button>
				</div>
			</div>
			<van-button class="allFocusBtn" :disabled="isAllFocus" :loading="allFocusLoad" @click="allFocus()"
				>{{ isAllFocus ? '任務已完成' : '一鍵關注' }}
			</van-button>
			<div v-if="inenType == 1" class="tips">*每天最多可關注5個{{ inenTitle }}</div>
			<div v-if="inenType == 2" class="tips">*每天最多可關注2個{{ inenTitle }}</div>
		</div>
	</van-popup>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import defaultIcon from '@img/defualtIcon.png'
import iconV from '@img/doTasks/icon_V.png'
import enterIcon from '@img/doTasks/enterpriselogo.png'
import config from '@api/config.js'
const tbac = config

const router = useRouter()
const props = defineProps({
	// 弹窗状态
	popState: {
		type: Boolean,
		default() {
			return false
		},
	},
	inenList: {
		type: Array,
		default() {
			return [
				{
					logo: '', //logo
					code: '', //中央编码
					name: '', //名称
					enName: '', //英文名称
					isFocus: false, //是否关注
					intro: '', //企业号简介
				},
			]
		},
	},
	//1機構號 2企業號
	inenType: {
		type: Number,
		default() {
			return 1
		},
	},
	// 是否一键关注
	isAllFocus: {
		type: Boolean,
		default() {
			return false
		},
	},
	// 一鍵關注Load状态
	allFocusLoad: {
		type: Boolean,
		default() {
			return false
		},
	},
})
const inenTitle = computed(() => (props.inenType == 1 ? '機構號' : '企業號'))
let inenShow = ref(false)
watch(
	() => props.popState,
	(newVal, oldVal) => {
		inenShow.value = newVal
	}
)
const emits = defineEmits(['close', 'triggerFocus', 'triggerAllFocus', 'triggerView', 'triggerGotoview'])
// 关闭弹窗
function closePop() {
	emits('close')
}
function setDefaultImage(e) {
	e.target.src = defaultIcon
}
// 关注
function focus(item, index) {
	emits('triggerFocus', item, index)
}
function gotoview(item, index) {
	console.log(item, '子组件传参')
	emits('triggerGotoview', item, index)
}
// 一键关注
function allFocus() {
	emits('triggerAllFocus')
}
// 查看详情
function view(item) {
	emits('triggerView', item)
}
</script>

<style scoped lang="scss">
.popWrap {
	max-height: 600px;
	.title {
		font-size: 24px;
		font-weight: bold;
		color: #323233;
		line-height: 28px;
		padding: 40px 0 16px;
		position: relative;
		text-align: center;
		&::before {
			content: '';
			position: absolute;
			width: 40px;
			height: 4px;
			background: #e1e4e6;
			border-radius: 20px;
			top: 17px;
			left: 50%;
			transform: translateX(-50%);
		}
	}
	.inen {
		padding: 0 25px;
		.inenItem {
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #eceef0;
			padding: 10px 0 6px;
			&:last-child {
				border-bottom: 0;
			}
			.inenLeft {
				text-align: center;
			}
			.inenIogo {
				width: 30px;
				height: 30px;
				border-radius: 4px;
				border: 1px solid #e1e4e6;
				margin-bottom: 7px;
				margin-top: 4px;
			}
			.code {
				font-size: 10px;
				color: #a6a9b6;
				line-height: 12px;
				width: 50px;
			}
			.inenCenter {
				width: calc(100% - 125px);
				margin-left: 7px;
			}
			.name {
				font-size: 16px;
				font-weight: bold;
				color: #333333;
				line-height: 22px;
			}
			.enName {
				font-size: 12px;
				color: #a6a9b6;
				line-height: 16px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-bottom: 3px;
			}
			.sign {
				font-size: 10px;
				font-weight: bold;
				color: #646566;
				line-height: 16px;
				display: flex;
				align-items: center;
				img {
					height: 16px;
					width: 16px;
					vertical-align: middle;
					margin-right: 2px;
				}
			}
			.focusBtn {
				width: 64px;
				height: 24px;
				border-radius: 40px;
				border: 1px solid #fe3d48;
				text-align: center;
				line-height: 24px;
				color: #fe3d48;
				font-size: 12px;
				padding: 0;
				left: 5px;
				:deep(.van-button__content) {
					height: 24px;
				}
				&.van-button--disabled {
					color: #a6a9b6;
					border-color: #a6a9b6;
				}
			}
		}
	}
	.inen2 {
		.inenLeft {
			position: relative;
			.inenIogo {
				border-radius: 20px;
			}
			.enterIcon {
				height: 16px;
				width: 16px;
				position: absolute;
				right: -4px;
				top: 22px;
			}
		}
		.inenCenter {
			.enName {
				-webkit-line-clamp: 2;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				white-space: normal;
			}
		}
	}
	.allFocusBtn {
		width: 311px;
		height: 48px;
		background: #fe3d48;
		border-radius: 100px;
		text-align: center;
		font-size: 16px;
		font-weight: bold;
		color: #ffffff;
		margin: 20px auto 10px;
		display: block;
		:deep(.van-button__content) {
			height: 48px;
		}
	}
	.tips {
		font-size: 12px;
		color: #a6a9b6;
		line-height: 14px;
		text-align: center;
		padding-bottom: 54px;
	}
}
</style>
