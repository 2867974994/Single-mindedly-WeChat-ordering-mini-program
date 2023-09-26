const app=getApp();
const url=app.globleData.url;
//const util=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbox:[
      {classid:"1",pic:`${url}/icon/guanguo.png`,title:"干锅"},
      {classid:"2",pic:`${url}/icon/tangguo.png`,title:"汤锅"}
    ]//用于存储导航项的信息包括ID，pic（图片路径）和导航的标题
  },
  foodtap(event){    
    let id = event.currentTarget.dataset.id;//获取食物项的id数据
    wx.navigateTo({
      // 模板字符串
      url: `../content/content?id=${id}`
    })
  },
  //一个事件处理函数，用于处理食物项的点击事件
  swipertap(event){    
    let id = event.target.dataset.id;
    //// 获取食物项的ID数据,处理轮播图项的点击事件
    wx.navigateTo({
      url: '../content/content?id='+id
    })
    //将ID作为参数传递给目标页面
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    /**获取胶囊位置需要在页面加载时完成 */
    let menu = wx.getMenuButtonBoundingClientRect();
    this.setData({/**用来设置data中的数据 */
      menutop:menu.top
    });
     //从服务器获取数据,条件isgood>0
     const db=wx.cloud.database();
     //获取云端数据
     db.collection('foods').field({//选择要查询的集合
      //返回指定的对象
       isgood:true,
       pic:true,
       price:true,
       title:true,
       smalltext:true,
     }).where({
       isgood:db.command.gt(0)//获取数据表中isgood值大于0的数据信息（查询条件）
     }).get().then(res=>{
        //console.log(res)
          let resArr=res.data;
          //对数据分组
          let swiper=[];
          let food=[];
          //查询成功后返回数据
          for(let i=0;i<resArr.length;i++){
            resArr[i].pic= url+ resArr[i].pic;//拼接图片路径
            if(resArr[i].isgood==1){
              swiper.push(resArr[i])//将isgood为1的存入swiper数组
            }else{
              food.push(resArr[i])//其他情况存入food数组
            }
          }
          this.setData({
            swiper,
            food
          })
          // 更新页面的数据，将分组后的数据存入swiper和food
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