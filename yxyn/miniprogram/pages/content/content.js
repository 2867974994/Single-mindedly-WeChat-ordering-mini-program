//引入了小程序的全局对象和工具函数：  
const app=getApp();
const url=app.globleData.url;
const util=require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isplay:false,
    // isStorage:false
  },
  //音乐暂停
  audioPause(){
    this.data.IAC.pause();
    // 更新页面数据，将 isplay 设置为 false
    this.setData({
      isplay:false
    })
  },
  //音乐播放
  audioPlay(){
    this.data.IAC.play();
    // 更新页面数据，将 isplay 设置为 true
    this.setData({
      isplay:true
    })
  },
  //跳转到订座页面(tabBar界面)
  reserTap(){
    wx.switchTab({
      url: '../reser/reser',
    })
  },
  //用户取消收藏处理函数
  removeS(){
    //console.log('取消收藏')
    let sto=wx.getStorageSync('storage');
     // 获取当前食品的唯一标识作为收藏的键名
    let stoName=this.data.food._id;
     // 从收藏数据中删除当前食品
    delete sto[stoName];
      // 如果收藏数据为空对象，则移除缓存中的收藏数据；否则更新缓存中
    if(JSON.stringify(sto)=='{}'){
      wx.removeStorageSync('storage')
    }else{
      wx.setStorageSync('storage', sto)
    }
    // 更新页面数据，将 isStorage 设置为 false
    this.setData({
      isStorage:false
    })
  },
  //用户点击收藏处理函数
  setS(){
     // 从缓存中获取收藏数据，如果不存在则初始化为空对象
    let sto=wx.getStorageSync('storage')||{};
    // 获取当前食品的唯一标识作为收藏的键名
    let stoName=this.data.food._id;
    // 构造要存储的收藏对象，包括id、标题和图片信息 
    sto[stoName]={
      id:this.data.food._id,
      title:this.data.food.title,
      pic:this.data.food.pic
    }
    //将上述数据放置到缓存storage中
    wx.setStorageSync('storage', sto);
    // 更新页面数据，标记为已收藏 
    this.setData({
      isStorage:true
    })
  },
   //将异步==>同步
   getData:async(id)=>{
    const db=wx.cloud.database();//创建数据库对象db
     // 通过id查询相应的食品数据，并指定需要返回的字段
    let food=await db.collection('foods').doc(id*1).field({
      pic:true,
      price:true,
      title:true,
      smalltext:true,
      parts:true,
    }).get()
     //console.log(food.data)
     
  // 通过查询到的食品数据中的parts字段，查询相应的部件数据
    let parts=await db.collection('parts').where({
      _id:db.command.in(food.data.parts)
    }).get()
    // 将部件数据赋值给食品数据的parts字段
    food.data.parts=parts.data;
    return food.data;// 返回获取到的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
    //判断当前页面是否有缓存
    //console.log(options)
    console.log(options.id)
    let sto=wx.getStorageSync('storage');
    //指定对象中是否有指定的属性，返回布尔值
    let stoBool = sto.hasOwnProperty(options.id);
    this.setData({
      isStorage:stoBool
    })
     //根据id到服务器查询相应数据，绑定到页面
     this.getData(options.id).then(res=>{
      //console.log(res);
      res.pic= url+res.pic;
      this.setData({
        food:res
      })
      //动态设置导航栏标题
      wx.setNavigationBarTitle({
        title:res.title
      })


    })

    this.setData({      
      //创建音频
      "IAC":wx.createInnerAudioContext(),
      "IAC.src":`${url}/music.mp3`,
      "IAC.loop":true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //页面卸载时停止音乐
    this.data.IAC.pause();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
