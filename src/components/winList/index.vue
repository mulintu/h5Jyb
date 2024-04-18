<template>
	<div class="winList">
		<div class="winListBox">
			<div class="winListTitle"></div>
			<div class="list">
				<div class="tableH">
					<span>中獎時間</span>
					<span>中獎ID</span>
					<span>獎勵名稱</span>
				</div>
				<div v-if="list.length" class="forDiv">
					<div v-for="item in list" :key="item" class="tableTr">
						<span>{{ FilterDate(item.createTime, 11, 16) }}</span>
						<span>{{ item.uid }}</span>
						<span>{{ item.prize }}</span>
					</div>
				</div>
			</div>
			<div v-if="!list.length" class="nodata">當前免單中獎還未公示哦～</div>
			<div class="tips">{{ tips }}</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FilterDate } from '@js/Utils'
const props = defineProps({
	list: {
		type: Array,
		default() {
			return []
		},
	},
	tips: {
		type: String,
		default() {
			return '中獎用戶可添加客服微信：Alien_009，查詢具體獎勵領取情況'
		},
	},
})
</script>

<style scoped lang="scss">
.winList {
	padding: 20px 11px 16px;
	.winListBox {
		// max-height: 405px;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0px 18px 38px 0px rgba(166, 100, 2, 0.1);
		border-radius: 20px;
		border: 2px solid #ffd3ae;
		text-align: center;
		position: relative;
		padding-top: 47px;
		.winListTitle {
			height: 60px;
			width: 100%;
			background: url('@img/winListTitle.png') center/300px no-repeat;
			position: absolute;
			top: -15px;
		}
		.list {
			padding: 0 17px;
			font-size: 12px;
			color: #5f3f51;

			.tableH {
				font-size: 14px;
				color: #97143a;
				line-height: 16px;
				border-bottom: 1px solid #f9f1f1;
				margin-bottom: 6px;
				display: flex;

				span {
					font-weight: bold;
					flex: 1;
					line-height: 40px;
				}
			}
			.forDiv {
				.tableTr {
					span {
						line-height: 16px;
						padding: 8px 0;
					}
				}
				& > div {
					display: flex;
					& > span {
						flex: 1;
						line-height: 40px;
					}
				}
			}
		}
		.nodata {
			text-align: center;
			font-size: 14px;
			color: #5f3f51;
			margin: 20px 0 30px;
		}
		.tips {
			font-size: 11px;
			color: #c1b3ba;
			margin-top: 17px;
			margin-bottom: 23px;
		}
	}
}
</style>
