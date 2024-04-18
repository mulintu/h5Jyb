import axios from 'axios'
import router from '../router'
import { JWT } from './index'
const jwt = axios.create({
	timeout: 300000,
	// baseURL:VITE_APP_WEB_URL,
	headers: {
		'Content-type': 'application/json;charset=UTF-8',
	},
})

jwt.interceptors.request.use(
	(config) => {
		config.headers = config.headers || {}
		let token = localStorage.getItem('SET_TOKEN')
		if (token) {
			config.headers.Authorization = token
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

jwt.interceptors.response.use(
	(response) => {
		let config = response.config
		if (!config.headers.Authorization || response.data.result == -605 || response.data.result == 1000) {
			return JWT().then((res) => {
				if (res.data.result == 1) {
					config.headers.accessToken = res.data.data
					localStorage.setItem('SET_TOKEN', res.data.data)
					config.baseURL = ''
					return jwt(config)
				} else {
					return Promise.reject(res.data)
				}
			})
		}
		return response
	},
	(error) => {
		router.push('/error')
		return Promise.reject(error)
	}
)

export default jwt
