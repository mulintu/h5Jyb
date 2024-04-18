/* 
  验证是否为正确的图片地址
  imageUrl：待验证地址
  withProtocol：地址是否包含协议
  @return 验证通过true，验证不通过false
*/
export const verifyUrl = (imageUrl, withProtocol = true) => {
	if (withProtocol) {
		return /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(imageUrl)
	}
	return /(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(imageUrl)
}

/* 
  验证是否为股票代码(A股)
  stockCode：待验证股票代码
  @return 验证通过true，验证不通过false
*/
export const verifyStockCode = (stockCode) => {
	return /^(s[hz]|S[HZ])(000[\d]{3}|002[\d]{3}|300[\d]{3}|600[\d]{3}|60[\d]{4})$/.test(stockCode)
}

/* 
  验证手机号码（严谨）
  mobilePhone：待验证手机号
  @return 验证通过true，验证不通过false
*/
export const verifyStrictMobilePhone = (mobilePhone) => {
	return /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(mobilePhone)
}

/* 
  验证手机号码（宽松）
  mobilePhone：待验证手机号
  @return 验证通过true，验证不通过false
*/
export const verifyLooseMobilePhone = (mobilePhone) => {
	return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(mobilePhone)
}

/* 
  验证座机号码
  mobilePhone：待验证手机号
  @return 验证通过true，验证不通过false
*/
export const verifyLandlineNumber = (mobilePhone) => {
	return /^\d{3}-\d{8}$|^\d{4}-\d{7,8}$/.test(mobilePhone)
}

/* 
  验证邮箱
  email：待验证邮箱
  @return 验证通过true，验证不通过false
*/
export const verifyEmail = (email) => {
	// eslint-disable-next-line no-useless-escape
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		email
	)
}
