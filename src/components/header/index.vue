<template>
	<div class="headerWrap">
		<div class="header">
			<div class="back" @click="leftClick"></div>
			{{ $t(`${store.cuurTo.meta.title}`) }}
			<div v-if="store.cuurTo.meta.showShare" class="shareBtn" @click="shareClick"></div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useUsersStore } from '@/store/user'
import AppInterfaceCommon from '@js/AppInterfaceCommon'
import { useRouter } from 'vue-router'
const router = useRouter()
const store = useUsersStore()
const emits = defineEmits(['triggerShare'])
// watch(
// 	() => store.cuurTo,
// 	(newVal, oldVal) => {
// 		console.log(newVal, '~~~~~~~~~~~~~~~~~~~~~')
// 	},
// 	{ deep: true }
// )

function leftClick() {
	const { path, query, name } = store.cuurFrom
	if (store.cuurTo.name !== 'index') {
		router.replace({
			path,
			query,
		})
		router.go(-1)
	} else {
		AppInterfaceCommon.closeWeb()
	}
}
function shareClick() {
	emits('triggerShare')
}
</script>

<style scoped lang="scss">
.headerWrap {
	height: 48px;
	.header {
		height: 48px;
		width: 100%;
		background: #fff;
		font-size: 16px;
		color: #000000;
		line-height: 48px;
		text-align: center;
		position: fixed;
		z-index: 10;
		width: 375px;
		.back,
		.shareBtn {
			width: 20px;
			height: 20px;
			background: url('@img/back.png') center/100% no-repeat;
			margin: 14px 13px;
			position: absolute;
		}
		.shareBtn {
			background-image: url('@img/share.png');
			right: 0;
			top: 0;
		}
	}
}
</style>
