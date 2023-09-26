App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    if (!wx.cloud) {
      //检查基础版数据库是否支持云能力
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      //初始化云开发能力
      wx.cloud.init({
        traceUser: true,
      });
    }
    // 获取本地缓存中的 openid
    let openid=wx.getStorageSync('openid')
    if(!openid){
      // 如果本地缓存中不存在 openid，则调用云函数获取用户信息并存储到本地缓存
      wx.cloud.callFunction({
        name:'userInfo'
      }).then(res=>{
        //console.log(res);
        wx.setStorageSync('openid', res.result.openid)
      })
    }
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
  globleData:{
    url:"cloud://cloud1-5gld3w0480398cc4.636c-cloud1-5gld3w0480398cc4-1311316501",
  },
  //回调函数封装wx.request
  //url:请求地址
  //callback:请求成功的会点函数名
  //异步请求机制，不能在success()中直接获取数据，需要使用回调函数
  getData1(geturl,callback){
    wx.request({
      url: geturl,
      success:(res)=>{
        callback(res.data)
      },
      fail(err){
        callback(err)
      }
    })
    //通过 wx.request 发送请求，并在请求成功时通过回调函数传递返回的数据，请求失败时传递错误信息。
  }
})
