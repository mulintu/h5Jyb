<template>
	<div class="coupon">
		<div class="couponCont">
			<div v-for="(item, index) in couponList" :key="item" class="couponItem">
				<div class="denomination">{{ item.value }}</div>
				<div class="couponDes">
					<div class="condition">滿{{ item.reach }}元可用</div>
					<div class="des">數量有限 領完即止</div>
					<van-button class="couponBtn" :loading="item.loading" @click="receive(item, index)">{{ item.received ? '去使用' : '點擊領券' }}</van-button>
				</div>
				<div class="couponType">行情優惠券</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
	couponList: {
		type: Array,
		default() {
			return []
		},
	},
})
const emits = defineEmits(['triggerReceive'])
function receive(item, index) {
	emits('triggerReceive', item, index)
}
</script>

<style scoped lang="scss">
.couponCont {
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
	.couponItem {
		width: 165px;
		height: 75px;
		background: #ffffff linear-gradient(227deg, #ffd092 0%, #ffe0c2 100%);
		box-shadow: 0px 17px 36px 0px rgba(166, 100, 2, 0.1);
		border-radius: 10px;
		border: 1px solid #ffd3ae;
		position: relative;
		display: flex;
		padding: 8px 0;
		text-align: center;
		.couponType {
			position: absolute;
			top: -1px;
			left: -1px;
			width: 64px;
			height: 18px;
			background: linear-gradient(270deg, #ffb750 0%, #f2a452 100%);
			border-radius: 10px 0px 9px 0px;
			font-size: 9px;
			font-weight: bold;
			color: #ffffff;
			line-height: 19px;
		}
		.denomination {
			width: 41.2%;
			font-size: 38px;
			font-weight: bold;
			line-height: 75px;
			background: linear-gradient(180deg, #ff4949 0%, #e50236 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			border-right: 1px dashed #f83644;
		}
		.couponDes {
			width: 58.8%;
			text-align: left;
			padding-left: 7px;
			.condition {
				font-size: 13px;
				font-weight: bold;
				color: #323233;
				line-height: 17px;
				margin: 4px 0 2px;
			}
			.des {
				font-size: 8px;
				color: #5f3f51;
				line-height: 11px;
				white-space: nowrap;
			}
			.couponBtn {
				width: 68px;
				height: 18px;
				background: linear-gradient(270deg, #fd3915 0%, #ff4d77 100%);
				border-radius: 60px;
				font-size: 9px;
				font-weight: bold;
				// line-height: 19px;
				color: #ffd9b9;
				text-align: center;
				margin-top: 6px;
				padding: 0;
				border: 0;
				:deep(.van-button__content) {
					height: 19px;
				}
			}
		}
	}
}
</style>
