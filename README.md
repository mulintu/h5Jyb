# tive-vue3-vite-demo

## 项目介绍

此项目使用 `Vite 2.x` + `Vue 3.x` 构建，集成了以下功能：

1. 若有新项目，全局替换本项目中的 newh5 为你的新项目名。
2. `lib-flexible`+`rem`移动端适配，默认为`375px`设计稿的适配，若是`750px`的设计稿可调整`remUnit`的值，轻松适配。
3. 使用`pinia`可直接获取 uid、session、mobile（外部登录用户信息默认保持登录两小时）、source(来源 0: 大陆 1: 香港)
4. `hooks-useRegisterDate.js`，可根据注册时间获取是否是新用户
5. 公共组件：登录、注册、下载 (公共组件都在 src/components 目录下)
6. 活动公共组件：(公共组件都在 src/components 目录下)
   规则页 src/components/rule/index.vue
   规则弹窗 src/components/rule/RulePopup.vue
   优惠券 src/components/coupon/index.vue
   优惠券领取成功弹窗 src/components/coupon/CouponPop.vue
   返回顶部 src/components/footer/index.vue
   任务列表 src/components/tasks/index.vue
   做任务-关注机构号/企业号弹窗 src/components/tasks/InEnPop.vue
   做任务-添加自选股 src/components/tasks/selfStockPop.vue
   抽奖转盘 使用 LuckyWheel,lucky-canvas/vue 插件教程：https://100px.net/
   中奖弹窗 src/components/turntable/PrizePopup.vue
   活动中奖名单 src/components/winList/index.vue
   我的中奖记录 src/components/winRecord/index.vue
   头部返回 src/components/header/index.vue
   facebook 登录 src/components/facebookLogin/index.vue 和 @/hooks/facebookLogin

   ```
   pnpm i
   pnpm run dev
   ```
