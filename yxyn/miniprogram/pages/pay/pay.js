// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:1.23
  },
  pay(event){
    console.log(event)
    //console.log(event.target.dataset.money)
    //console.log(new Date().getTime()+"51zxw"+new Date().getTime())
    //console.log(Math.random().toString(36).substr(2))
    
    //将小程序端数据传递给云函数
    wx.cloud.callFunction({
    //timeStamp=timeStamp/1000;
      name:"pay_yh",
      data:{
        //总金额
        totalFee:event.target.dataset.money,
        //订单号小于32位
        outTradeNo:new Date().getTime()+"51zxw"+new Date().getTime(),
        //随机字符串小于32位
        nonceStr:Math.random().toString(36).substr(2)
      }
    }).then(res=>{
      console.log(res)
      const payment = res.result.payment
      wx.requestPayment({
        timeStamp: "payment.timeStamp",
        nonceStr: "payment.nonceStr",
        package: "payment.package",
        signType: 'MD5',
        paySign: "payment.paySign",
        success: (res=>{
          wx.showToast({
            title: '支付成功',
          })
        }),
        fail: (res=>{
          wx.showToast({
            title: '支付失败',
          })
        })
      })
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})