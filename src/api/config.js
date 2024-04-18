import uat from './uat'
import live from './live'
import gray from './gray'
let config = {}
const mode = import.meta.env.VITE_APP_MODE
if (mode === 'production') {
	//live
	config = { ...live }
} else if (mode == 'uat') {
	config = { ...uat }
} else if (mode == 'gray') {
	config = { ...gray }
} else {
	config = {
		api: '/api',
		liveapi: '/liveapi',
		iqdii: '/iqdii',
		tbac: '/tbac',
	}
}

export default config
