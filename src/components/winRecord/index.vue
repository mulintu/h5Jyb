<template>
	<div class="record">
		<slot name="recordTitle"></slot>
		<div class="recordBg">
			<div class="recordBox">
				<van-loading v-show="loading" />
				<div v-for="item in list" :key="item.id" class="prizeItem">
					<div class="prizeL">
						<div class="prizeName">{{ item.prize }}</div>
						<div class="prizeTime">于{{ FilterDate(item.createTime, 11, 19) }}获得</div>
					</div>
					<div v-if="item.isReceive" class="prizeBtn" @click="toReceive(true)">前往領取</div>
					<div v-else class="prizeBtn" @click="toMarketService()">前往查看</div>
				</div>
				<div v-if="!list.length && !loading" class="nodata">暫無記錄</div>
			</div>
			<div class="notes">*仅展示有效记录</div>
		</div>
		<div class="note">
			<div class="noteT">注意事項：</div>
			<p v-for="item in tipsList" :key="item">{{ item }}</p>
		</div>
		<van-overlay :show="receiveShow">
			<div class="receiveWrapper" @click.stop>
				<div class="receiveBg">
					<div class="receiveTitle">掃描二維碼添加客服微信</div>
					<div class="wxicon"><img src="@img/wx.png" />微信號：Alien_009</div>
					<div>
						<img src="@img/QRcode.png" />
					</div>
					<div class="tip">請在活動有效期內兌換，過期無效</div>
				</div>
				<div class="close" @click.stop="toReceive(false)"></div>
			</div>
		</van-overlay>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppInterfaceCommon from '@js/AppInterfaceCommon'
import { isUat } from '@js/Utils'
import { useUsersStore } from '@/store/user'
import { type } from '@js/msg'
import { useRouter } from 'vue-router'
import { FilterDate } from '@js/Utils'
const router = useRouter()
const store = useUsersStore()
let receiveShow = ref(false)
let loading = ref(true)
const props = defineProps({
	list: {
		type: Array,
		default() {
			return []
		},
	},
	tipsList: {
		type: Array,
		default() {
			return []
		},
	},
})
watch(
	() => props.list,
	(newVal, oldVal) => {
		loading.value = false
	}
)

function toReceive(type) {
	receiveShow.value = type
}
function toMarketService() {
	if (type) {
		router.push('/downLoad')
	} else {
		let url = isUat ? `http://payuat.iqdii.com/Order/Service` : `https://pay.iqdii.com/Order/Service`
		AppInterfaceCommon.openGoodsWeb(url)
	}
}
</script>

<style scoped lang="scss">
.record {
	background: url('@img/rule/ruleBg.png') top/100% 100% no-repeat;
	padding: 0 10px 0px;
	height: 100vh;
	.recordTitle {
		padding: 24px 0 15px;
		font-size: 30px;
		font-weight: bold;
		line-height: 40px;
		// text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25), 0px 1px 0px #c50000, 0px 4px 4px rgba(249, 255, 175, 0.25);
		// -webkit-text-stroke: 1px #c50000;
		// text-stroke: 1px #c50000;
		background: linear-gradient(93deg, #fdf7e0 0%, #fdf9e7 63%, #fdfbeb 100%);
		-webkit-background-clip: text;
		// -webkit-text-fill-color: transparent;
		text-align: center;
		color: #fdf9e7;
		text-shadow: 2px 2px 2px #c50000, 2px -1px 2px #c50000, -2px -1px 2px #c50000, -2px 1px 2px #c50000;
	}
	.recordBg {
		background: #fff;
		box-shadow: 0px 18px 38px 0px rgba(166, 100, 2, 0.1);
		border-radius: 15px;
		height: calc(100% - 380px);
		.notes {
			font-size: 12px;
			color: #c1b3ba;
			line-height: 14px;
			text-align: center;
			padding: 10px 0 12px;
		}
	}
	.recordBox {
		padding: 13px 24px 0;
		// min-height: 60px;
		height: calc(100% - 36px);
		overflow: auto;
		.van-loading {
			text-align: center;
		}
		.prizeItem {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 14px;
			color: #5f3f51;
			padding-top: 10px;
			padding-bottom: 10px;
			border-bottom: 1px solid #f9f1f1;
			.prizeL {
				width: calc(100% - 70px);
			}
			.prizeName {
				line-height: 20px;
				font-weight: bold;
			}
			.prizeTime {
				font-size: 12px;
				font-weight: normal;
				color: #c1b3ba;
				line-height: 15px;
			}
			.prizeBtn {
				font-weight: bold;
				width: 70px;
				height: 30px;
				line-height: 30px;
				border-radius: 24px;
				opacity: 1;
				border: 1px solid #fe3d48;
				text-align: center;
				font-size: 12px;
				color: #fe3d48;
			}
		}
		.nodata {
			text-align: center;
			font-size: 14px;
			color: #5f3f51;
		}
	}
	.note {
		font-size: 13px;
		color: rgba(126, 99, 97, 0.9);
		padding: 0 12px;

		.noteT {
			font-weight: bold;
			line-height: 16px;
			margin: 34px 0 15px;
		}
		p {
			line-height: 16px;
		}
	}
	.receiveWrapper {
		position: relative;
		top: 50%;
		transform: translateY(-50%);
		.receiveBg {
			width: 335px;
			height: 360px;
			background: #ffffff;
			box-shadow: 0px 18px 38px 0px rgba(166, 100, 2, 0.1);
			border-radius: 20px;
			border: 1px solid #ffd4b0;
			margin: auto;
			position: relative;
			text-align: center;
			.receiveTitle {
				font-size: 24px;
				font-weight: bold;
				color: #333333;
				line-height: 28px;
				margin: 40px 0 10px;
			}
			.wxicon {
				font-size: 18px;
				color: #666666;
				line-height: 28px;
				img {
					height: 20px;
					width: 20px;
					margin: 0 5px 0 0;
					vertical-align: -3px;
				}
			}
			img {
				height: 150px;
				width: 150px;
				margin: 28px 0 17px;
			}
			.tip {
				font-size: 14px;
				color: #969799;
				line-height: 16px;
			}
		}
		.close {
			width: 40px;
			height: 40px;
			background: url('@img/close.png') center/100% 100% no-repeat;
			margin: 24px auto 0;
		}
	}
}
</style>
