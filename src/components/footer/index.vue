<template>
	<div class="footer">
		<div class="goHeader" @click="goHeader">返回頂部 <span>↑</span></div>
		<div>在法律允許範圍內，捷利交易寶享有對此活動的最終解釋決定權</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
onMounted(() => {})
function goHeader() {
	let top = document.documentElement.scrollTop || document.body.scrollTop
	// 实现滚动效果
	const timeTop = setInterval(() => {
		document.body.scrollTop = document.documentElement.scrollTop = top -= 50
		if (top <= 0) {
			clearInterval(timeTop)
		}
	}, 10)
}
</script>

<style scoped lang="scss">
.footer {
	font-size: 10px;
	color: rgba(255, 255, 255, 0.5);
	line-height: 12px;
	text-align: center;
	padding-bottom: 40px;

	.goHeader {
		font-size: 12px;
		color: #fff;
		line-height: 14px;
		padding-top: 3px;
		margin-bottom: 10px;
		span {
			vertical-align: 0px;
			margin-left: 5px;
		}
	}
}
</style>
