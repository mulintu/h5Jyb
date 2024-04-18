import { ref, onMounted } from 'vue'
import { GetUserRegisterDate } from '@api/index'
export default async function () {
	let isNew = ref(false)
	const result = await GetUserRegisterDate()
	if (result.data.result == 1) {
		var newTime = result.data.data.registerDate.replace(/-/g, '/')
		newTime = newTime.split(' ')[0]
		newTime = new Date(newTime)
		var startTime = new Date('2022/01/03') //活动开始日期
		if (newTime.getTime() - startTime.getTime() < 0) {
			// 老用户
			isNew.value = false
		} else {
			// 新用户
			isNew.value = true
		}
	}

	return {
		isNew,
	}
}
