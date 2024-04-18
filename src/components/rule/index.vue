<template>
	<div class="rule">
		<slot>
			<div class="ruleTitle">{{ ruleTitle }}</div>
		</slot>
		<div class="ruleBox">
			<div v-for="item in ruleMsg" :key="item">
				<div class="headline">{{ item.headline }}</div>
				<div v-for="subItem in item.subTitleArr" :key="subItem">
					<div v-if="subItem.subTitle" class="subtitle">{{ subItem.subTitle }}</div>
					<p v-for="pItem in subItem.pArr" :key="pItem">{{ pItem }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	ruleTitle: {
		type: String,
		default() {
			return '活动规则'
		},
	},
	ruleMsg: {
		type: Array,
		default() {
			return [
				{
					headline: '', //一级标题
					subTitleArr: [
						{
							subTitle: '', //二级标题
							pArr: [], //内容
						},
					],
				},
			]
		},
	},
})
</script>

<style scoped lang="scss">
.rule {
	background: url('@img/rule/ruleBg.png') top/100% 100% no-repeat;
	padding: 0 10px 20px;
	min-height: 100vh;
	:deep(.ruleTitle) {
		padding: 24px 0 12px;
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
	.ruleBox {
		// height: 852px;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0px 18px 38px 0px rgba(166, 100, 2, 0.1);
		border-radius: 20px;
		border: 2px solid #ffd3ae;
		padding: 20px 15px;
		p,
		div {
			line-height: 16px;
		}
		> div:first-child .headline {
			margin-top: 0;
		}
	}
	.headline {
		font-size: 16px;
		font-weight: bold;
		color: #97143a;
		margin-top: 32px;
	}
	.subtitle {
		font-size: 13px;
		font-weight: bold;
		color: #97143a;
		margin-top: 16px;
	}
	p {
		font-size: 13px;
		color: #7e6361;
	}
}
</style>
