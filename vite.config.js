import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path' // 主要用于alias文件路径别名
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import eslintPlugin from 'vite-plugin-eslint'
import legacyPlugin from '@vitejs/plugin-legacy' //浏览器兼容
// https://vitejs.dev/config/

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
	root: process.cwd(),
	base: './', // 如果是根目录部署请配置为 /
	// mode: process.env.NODE_ENV,
	publicDir: 'public',
	plugins: [
		vue(),
		// visualizer({
		// 	emitFile: false,
		// 	file: 'stats.html', //分析图生成的文件名
		// 	open: true, //如果存在本地服务端口，将在打包后自动展示
		// }),
		viteCompression({
			verbose: true,
			disable: false, // 不禁用压缩
			deleteOriginFile: false, // 压缩后是否删除原文件
			threshold: 10240, // 压缩前最小文件大小
			algorithm: 'gzip', // 压缩算法
			ext: '.gz', // 文件类型
		}),
		Components({
			dirs: ['src/components'], //可存在多个
			resolvers: [VantResolver()],
		}),
		// 增加下面的配置项,这样在运行时就能检查eslint规范
		eslintPlugin({
			include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
		}),
		legacyPlugin({
			targets: ['chrome 52'], // 需要兼容的目标列表，可以设置多个
			additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 面向IE11时需要此插件
		}),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@api': resolve(__dirname, 'src/api'),
			'@js': resolve(__dirname, 'src/assets/js'),
			'@img': resolve(__dirname, 'src/assets/img'),
			'@components': resolve(__dirname, 'src/components'),
		},
	},
	server: {
		port: '8090',
		strictPort: false,
		open: false,
		cors: true,
		proxy: {
			// 选项写法
			'/api': {
				target: 'http://cloudapiuat.iqdii.com/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
			'/liveapi': {
				target: 'http://cloudapi.iqdii.com/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/liveapi/, ''),
			},
			'/iqdii': {
				target: 'http://jybapisit.iqdii.com/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/iqdii/, ''),
			},
			'/tbac': {
				target: 'http://tbmanageuat.iqdii.com/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/tbac/, ''),
			},
		},
	},
	build: {
		// outDir: 'dist',
		assetsDir: 'assets',
		sourcemap: false, //不生成sourcemap
		manifest: false,
		brotliSize: false,
		cssCodeSplit: true, //css 拆分 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
		// minify: false, //是否禁用最小化混淆，esbuild打包速度最快，terser打包体积最小。
		minify: 'terser',
		assetsInlineLimit: 5000, //小于该值 图片将打包成Base64
		terserOptions: {
			compress: {
				// warnings: false,
				drop_console: true, //打包时删除console
				drop_debugger: true, //打包时删除 debugger
				pure_funcs: ['console.log'],
			},
			output: {
				// 去掉注释内容
				comments: true,
			},
		},
		rollupOptions: {
			output: {
				manualChunks: {
					// 拆分代码，这个就是分包，配置完后自动按需加载，现在还比不上webpack的splitchunk，不过也能用了。
					vue: ['vue', 'vue-router'],
					vant: ['vant'],
					axios: ['axios'],
					pinia: ['pinia'],
					vconsole: ['vconsole'],
					vueI18n: ['vue-i18n'],
				},
				// 最小化拆分包
				// manualChunks(id) {
				// 	if (id.includes('node_modules')) {
				// 		return id.toString().split('node_modules/')[1].split('/')[0].toString()
				// 	}
				// },
			},
		},
	},
	optimizeDeps: {
		include: [
			'vue',
			// "vuex",
			// "vue-router",
			// "vant",
			// "axios",
		],
	},
})
