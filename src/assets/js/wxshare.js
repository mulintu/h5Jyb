import axios from 'axios'
import wx from 'weixin-sdk-js'
import Qs from 'qs'
var WXShare = function (wxtitle, wxdesc, wxhref, wximg, istitle) {
	var vtitle = wxdesc
	if (istitle == 1) {
		vtitle = wxtitle
	}
	axios.post('https://jyb.iqdii.com/MutualStock/WXShare', Qs.stringify({ url: window.location.href })).then((res) => {
		// console.log("二次分享获取的数据", res)
		let data = JSON.parse(res.data)
		//  console.log(data)
		wx.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: data.appId, // 必填，公众号的唯一标识
			timestamp: data.timestamp, // 必填，生成签名的时间戳
			nonceStr: data.nonceStr, // 必填，生成签名的随机串
			signature: data.signature, // 必填，签名，见附录1
			menuItem: 'addContact',
			jsApiList: [
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'onMenuShareQQ',
				'onMenuShareWeibo',
				'updateAppMessageShareData',
				'updateTimelineShareData',
			], // 必填，需要使用的JS接口列表。
		})
	})
	wx.ready(function () {
		// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

		//获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
		wx.onMenuShareTimeline({
			title: wxtitle, // 分享标题
			link: wxhref, // 分享链接
			imgUrl: wximg, // 分享图标
			trigger: function (res) {
				//监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
				//不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回。
			},
			success: function (res) {
				//接口调用成功时执行的回调函数。
			},
			cancel: function (res) {
				//用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
			},
			fail: function (res) {
				//接口调用失败时执行的回调函数。
			},
			complete: function (res) {
				//接口调用完成时执行的回调函数，无论成功或失败都会执行。
			},
			//以上几个函数都带有一个参数，类型为对象，其中除了每个接口本身返回的数据之外，还有一个通用属性errMsg，其值格式如下：
			/*调用成功时："xxx:ok" ，其中xxx为调用的接口名
            用户取消时："xxx:cancel"，其中xxx为调用的接口名
            调用失败时：其值为具体错误信息
        */
		})

		//获取“分享给朋友”按钮点击状态及自定义分享内容接口
		wx.onMenuShareAppMessage({
			title: wxtitle, // 分享标题
			desc: wxdesc, // 分享描述
			link: wxhref, // 分享链接
			imgUrl: wximg, // 分享图标
			type: 'link', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: function () {
				// 用户确认分享后执行的回调函数
			},
			cancel: function () {
				// 用户取消分享后执行的回调函数
			},
		})
		//获取“分享到QQ”按钮点击状态及自定义分享内容接口
		wx.onMenuShareQQ({
			title: wxtitle, // 分享标题
			desc: wxdesc, // 分享描述
			link: wxhref, // 分享链接
			imgUrl: wximg, // 分享图标
			success: function () {
				// 用户确认分享后执行的回调函数
			},
			cancel: function () {
				// 用户取消分享后执行的回调函数
			},
		})
		//获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
		wx.onMenuShareWeibo({
			title: vtitle, // 分享标题
			desc: wxdesc, // 分享描述
			link: wxhref, // 分享链接
			imgUrl: wximg, // 分享图标
			success: function () {
				// 用户确认分享后执行的回调函数
			},
			cancel: function () {
				// 用户取消分享后执行的回调函数
			},
		})
		// wx.updateAppMessageShareData({
		//     title: wxtitle, // 分享标题
		//     desc: wxdesc, // 分享描述
		//     link: wxhref, // 分享链接
		//     imgUrl: wximg, // 分享图标
		//     success: function () {
		//      // 设置成功
		//      console.log("分享到微信或者QQ成功返回的信息为:", res);
		//      this.$toast("设置成功!");
		//     }
		// });
		// wx.updateTimelineShareData({
		//     title: wxtitle, // 分享标题
		//     desc: wxdesc, // 分享描述
		//     link: wxhref, // 分享链接
		//     imgUrl: wximg, // 分享图标
		//     success: function () {
		//      // 设置成功
		//      console.log("分享到朋友圈成功返回的信息为:", res);
		//      this.$toast("设置成功!");
		//     }
		// })
	})
}

export default WXShare
