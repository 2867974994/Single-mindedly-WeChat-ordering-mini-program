const app=getApp();
const url=app.globleData.url;
//const util=require('../../utils/util.js')
// pages/list/list.js
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  // 点击食物项触发的事件
  foodtap(event){    
    let id = event.currentTarget.dataset.id;
    console.log(event)
    wx.navigateTo({
      // 模板字符串
      url: `../content/content?id=${id}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // let at=wx.getStorageSync('abc')
    // console.log(at)
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.title
    })

    //从云数据库中获取数据，条件为classid==1为汤锅，等于2为干锅
    const db=wx.cloud.database();
     db.collection('foods').field({
       pic:true,
       price:true,
       title:true,
       smalltext:true,
     }).where({
      //options.classid获取的数据类型为字符串类型，而云数据库中的为number
       classid:options.classid*1
     }).limit(6).get().then(res=>{
       //console.log(res)
       let resArr=res.data;
       for(let i=0;i<resArr.length;i++){
         resArr[i].pic=url+resArr[i].pic;
       }
       //数据绑定
       this.setData({
         food:resArr,
         classid:options.classid,
         num:resArr.length
       })
     })
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
   * 应该在对应到json文件中加入"enablePullDownRefresh":true
   */
  onPullDownRefresh() {
    //console.log('监听');
    // wx.showToast({
    //   title: '正在刷新页面',
    // })
    wx.showLoading({
      title: '正在刷新页面',
    })
    const db=wx.cloud.database();
     db.collection('foods').field({
       pic:true,
       price:true,
       title:true,
       smalltext:true,
     }).where({
      //options.classid获取的数据类型为字符串类型，而云数据库中的为number
       classid:this.data.classid*1
     }).limit(this.data.num).get().then(res=>{
       console.log(res.data)
       let resArr=res.data;
       //console.log(resArr)
       for(let i=0;i<resArr.length;i++){
         resArr[i].pic=url+resArr[i].pic;
       }
       //数据绑定
       this.setData({
         food:resArr
       })
       wx.hideLoading();
     })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom:function() {
     //上拉触底时在当前页面显示顶部标题栏加载动画
     wx.showNavigationBarLoading();
     const db=wx.cloud.database();
     db.collection('foods').field({
       pic:true,
       price:true,
       title:true,
       smalltext:true,
     }).where({
      //options.classid获取的数据类型为字符串类型，而云数据库中的为number
       classid:this.data.classid*1
     }).skip(this.data.num).limit(3).get().then(res=>{
        //判断空数组
        if(res.data.length==0){
          return false;
        }
        //console.log(res.data)
        let resArr=res.data;
        for(let i=0;i<resArr.length;i++){
          resArr[i].pic= url+ resArr[i].pic;
        }
        //数据绑定
        this.setData({
          food: this.data.food.concat(resArr),
          num: this.data.num+resArr.length
        })
        wx.hideNavigationBarLoading();
     })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})