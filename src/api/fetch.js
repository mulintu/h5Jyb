import axios from 'axios'
// import {lang} from "@js/msg"

const service = axios.create({
	timeout: 300000,
	// baseURL:VITE_APP_WEB_URL,
	headers: {
		'Content-type': 'application/json;charset=UTF-8',
	},
})

service.interceptors.request.use(
	(config) => {
		config.headers = config.headers || {}
		// config.headers['Lang'] = lang  // 简繁体
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

service.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		return Promise.reject(error)
	}
)

export default service
