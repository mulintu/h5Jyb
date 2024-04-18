<template>
	<div class="tasks">
		<div v-for="(item, index) in tasksList" :key="item" class="tasksItem">
			<img :src="item.icon" />
			<div class="tasksText">
				<div class="tasksName">
					{{ item.taskName }}<span v-if="item.totalTasks">（{{ item.completedTasks }}/{{ item.totalTasks }}）</span>
					<span v-if="item.noLimitation">{{ item.noLimitation }}</span>
				</div>
				<div class="des">{{ item.taskDes }}</div>
			</div>
			<van-button class="tasksBtn" :disabled="item.completed" @click="doTask(item, index)">{{ item.completed ? '已完成' : item.btnText }}</van-button>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue'
import taskIcon from '@img/prize/taskIcon.png'
const props = defineProps({
	tasksList: {
		type: Array,
		default() {
			return [
				{
					icon: taskIcon,
					taskName: '任务名',
					taskDes: '任务描述',
					btnText: '去關注',
					completed: false, //是否已完成
					totalTasks: 0,
					completedTasks: 0,
				},
			]
		},
	},
})
const emits = defineEmits(['triggerDoTask'])
function doTask(item, index) {
	emits('triggerDoTask', item, index)
}
</script>

<style scoped lang="scss">
.tasks {
	background: #ffffff;
	box-shadow: 0px 18px 38px 0px rgba(166, 100, 2, 0.1);
	border-radius: 15px;
	padding: 14px;
	margin: 0 10px;
	.tasksItem {
		display: flex;
		padding: 16px 0;
		border-bottom: 1px solid #f9f1f1;
		&:last-child {
			border-bottom: 0;
		}
		img {
			height: 36px;
			width: 36px;
		}
		.tasksText {
			font-size: 16px;
			color: #5f3f51;

			width: calc(100% - 106px);
			margin: 0 4px;
			.tasksName {
				font-weight: bold;
				line-height: 22px;
				span {
					font-size: 12px;
					font-weight: bold;
					color: #5f3f51;
					font-family: MiSans-Medium;
					line-height: 14px;
				}
			}
			.des {
				font-size: 12px;
				color: #c1b3ba;
				line-height: 14px;
			}
		}
		.tasksBtn {
			height: 36px;
			width: 70px;
			line-height: 70px;
			background: url('@img/prize/tasksBtn.png') center/100% no-repeat;
			text-align: center;
			font-size: 12px;
			font-weight: bold;
			color: #ffebdb;
			padding: 0;
			border: 0;
			&:active:before {
				opacity: 0;
			}
		}
	}
}
</style>
