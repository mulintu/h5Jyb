<template>
	<div class="container">
		<router-view v-slot="{ Component }">
			<keep-alive>
				<component :is="Component" v-if="$route.meta.keepAlive" :key="$route.path"></component>
			</keep-alive>
			<component :is="Component" v-if="!$route.meta.keepAlive"></component>
		</router-view>
	</div>
</template>

<script setup></script>

<style lang="scss">
.container {
	margin: 0 auto;
	max-width: 375px;
}
</style>
