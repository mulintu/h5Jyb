import { defineStore } from 'pinia'
import utils from '@js/Utils'
import { uid, session, mobile } from '@js/msg'
import { queryArea } from '@api/index'

export const useUsersStore = defineStore('users', {
	state: () => {
		return {
			uid: uid,
			session: session,
			mobile: mobile,
			source: 0, //渠道来源 (0: 大陆 1: 香港)
		}
	},
	getters: {
		getUid: (state) => {
			let info = state.uid ? state.uid : JSON.parse(sessionStorage.getItem('yydsID'))
			const Str = utils.getCookie('newh5Info')
			if (!info && Str) {
				try {
					info = JSON.parse(Str).uids
				} catch (e) {
					console.log(e)
				}
			}
			return info
		},
		getSession: (state) => {
			let info = state.session ? state.session : JSON.parse(sessionStorage.getItem('yydsSession'))
			const Str = utils.getCookie('newh5Info')
			if (!info && Str) {
				try {
					info = JSON.parse(Str).session
				} catch (e) {
					console.log(e)
				}
			}
			return info
		},
		getMobile: (state) => {
			let info = state.mobile ? state.mobile : JSON.parse(sessionStorage.getItem('JYBMobile'))
			const Str = utils.getCookie('newh5Info')
			if (!info && Str) {
				try {
					info = JSON.parse(Str).phone
				} catch (e) {
					console.log(e)
				}
			}
			return info
		},
		getSource: (state) => {
			return state.source
		},
	},
	actions: {
		setUid(uid) {
			this.uid = uid
		},
		setSession(session) {
			this.session = session
		},
		setMobile(mobile) {
			this.mobile = mobile
		},
		async setSource() {
			const result = await queryArea()
			if (result.data.msg == 'success') {
				sessionStorage.setItem('chinese', JSON.stringify(result.data.data))
				this.source = result.data.data == 'CN' ? 0 : 1
			}
		},
	},
})
