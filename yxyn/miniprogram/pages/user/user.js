// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSto:true,
    hasUserInfo:true
  },  //定义两个初始数据属性 isSto控制选项卡切换，控制显示已收藏列表或查看订座列表视图

  tz(event){
    console.log(event)
    let id=event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../content/content?id=${id}`,
    })
  },
//自定义事件处理程序，wx.navigateTo保留当前页面，跳转到应用内某个页面


//选项卡切换
stoTap(){
  this.setData({
    isSto:true
  })
},
// 调用时将isSto属性设置为TRUE，用于切换选项卡。
reTap(){
  this.setData({
    isSto:false
  })
// 选项卡切换，切换到false表示查看订座列表
 const db = wx.cloud.database();//获得数据库实例
  db.collection('user').where({
    _openid:wx.getStorageSync('openid')//前半句获取user集合数据，后半句where获取特定用户数据
  }).field({
    info:true//设置返回字段为info
  }).get().then(res=>{
    console.log(res.data[0].info)//get获取数据，then处理返回结果
    let infoArr = res.data[0].info;
    for(let i=0;i<infoArr.length;i++){
      if(infoArr[i].resertime=='noon'){
        infoArr[i].resertime='午餐'
      }else{
        infoArr[i].resertime='晚餐'
      }
    }
    this.setData({
      info:infoArr
    })//数据设置到info中
  })


},
//获取用户信息
getUserProfile(){
  wx.getUserProfile({
    // 获取用户详细信息
    desc: '展示用户信息', 
    success: (res) => {
      //console.log(res)
      this.setData({
        avatarUrl:res.userInfo.avatarUrl,
        nickName:res.userInfo.nickName,
        hasUserInfo:false
      })
      // 通过set函数将用户信息设置到如上三个属性
    }
  })
},



//删除收藏信息
delSto(event){
  let stoArr= this.data.stoList;
  //console.log(stoArr)
  console.log(event)
  //删除数组中指定下标元素，通过splice函数
  stoArr.splice(event.target.dataset.idx,1);
  this.setData({
    stoList:stoArr
  })
  //清除单个缓存
  let sto = wx.getStorageSync('storage');
  let stoName =event.target.dataset.id;
  delete sto[stoName];
  console.log(sto)
  if(JSON.stringify(sto)=='{}'){
    wx.removeStorageSync('storage');
  }else{
    wx.setStorageSync('storage', sto);
  }

},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    //console.log('监听页面显示')
    //遍历对象，获取收藏数据
    let stoObj=wx.getStorageSync('storage');
    let key;
    let stoArr=[];
    //console.log(stoArr)
    for(key in stoObj){     
      stoArr.unshift( stoObj[key]);
    }
    //显示缓存中的数据信息
    console.log(stoArr)
    this.setData({
      stoList:stoArr
    })
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