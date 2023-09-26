// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: "cloud1-5glh72tx410dc8c9" }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.cloudPay.unifiedOrder({
    "body" : "一心一意餐厅",  //商家名称-销售商品类目
    "outTradeNo" : event.outTradeNo,//订单号少于32位,不能重复
    "spbillCreateIp" : "127.0.0.1",//回调的IP,直接默认127.0.0.1
    "subMchId" : "1234567890",//商户号
    "totalFee" : event.totalFee,//订单总金额，只能为整数，以分计
    "envId": "cloud1-5glh72tx410dc8c9",  //云环境ID
    "functionName": "pay_cb", //结果通知回调云函数名
    "nonceStr":event.nonceStr,   //随机字符串小于32位
    "tradeType":"JSAPI" //交易类型,小程序支付
  })
  return res
}