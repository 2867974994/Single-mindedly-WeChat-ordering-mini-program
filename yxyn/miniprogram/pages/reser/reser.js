// pages/reser/reser.js
const util = require('../../utils/util.js') // 通过 require 语句引入了一个名为 util.js 的模块。
Page({

  /**

   * 页面的初始数据
     */
       data: {

  },

  // 日期选择器变更事件处理函数
  datechange(event) {
    this.setData({
      date: event.detail.value // 将日期选择器选中的值存储在 data 对象的 date 属性中
    })
  },

  // 表单重置处理事件
  formReset() {
    this.setData({
      date: '' // 重置日期字段为空
    })
  },

  // 表单提交处理事件
  formSubmit(event) {
    console.log(event)
    let ev = event.detail.value; // 获取表单中用户输入的值，并将其存储在 ev 变量中

    if (ev.phone && ev.uname && ev.sex && ev.reserDate && ev.time) {
      // 检查表单中的必填字段是否都有值
    
      // 连接数据库
      const db = wx.cloud.database(); // 创建一个连接到云数据库的实例
    
      // 查询餐位信息
      db.collection('seat').doc(ev.reserDate).field({
        [ev.time]: true // 查询特定文档的特定字段值
      }).get().then(res => {
        let arr = Object.keys(res.data[ev.time]); // 获取查询结果中指定时间字段的键名（Key），并将其组成一个数组
    
        // 判断位置是否已满
        if (arr.length == 5) {
          // 位置已满，显示已定满的提示
          wx.showToast({
            title: '已定满',
            icon: 'error',
            duration: 3000
          })
        } else if (arr.indexOf(ev.phone) > -1) {
          // 用户已订过餐，显示已订餐的提示
          wx.showToast({
            title: '已订餐',
            icon: 'error',
            duration: 3000
          })
        } else {
          // 写入数据表
          res.data[ev.time][ev.phone] = ev.uname + ev.sex; // 在获取到的数据对象中添加用户的订餐信息
    
          db.collection('seat').doc(ev.reserDate).update({
            data: {
              [ev.time]: res.data[ev.time]
            }
          }).then(res2 => {
            // 查询 user 表是否有当前用户 openid，如果有执行更新，若没有执行添加
            db.collection('user').where({
              _openid: wx.getStorageSync('openid')
            }).get().then(res3 => {
              let obj = res3.data[0]; // 将查询结果存储在 obj 变量中即储存着openid
    
              if (obj) {
                // _openid 存在，直接写入数据
                db.collection('user').doc(obj._id).update({
                  data: {
                    info: db.command.unshift({ // 局部更新
                      reserdate: ev.reserDate,
                      resertime: ev.time,
                      tablenum: arr.length + 1
                    })
                  }
                }).then(res4 => {
                  // 订餐成功的提示，并跳转到查看所定桌号的页面
                  wx.showToast({
                    title: '订餐成功',
                    icon: 'error',
                    duration: 3000,
                    success: res6 => {
                      wx.switchTab({
                        url: '../user/user'
                      })
                    }
                  })
                })
    
              } else {
                // _openid 不存在，先创建对应 openid 的一条数据
                db.collection('user').add({
                  data: {
                    _openid: wx.getStorageSync('openid'),
                    info: [{
                      reserdate: ev.reserDate,
                      resertime: ev.time,
                      tablenum: arr.length + 1
                    }]
                  }
                }).then(res5 => {
                  // 订餐成功的提示，并跳转到查看所定桌号的页面
                  wx.showToast({
                    title: '订餐成功',
                    icon: 'error',
                    duration: 3000,
                    success: res6 => {
                      wx.switchTab({
                        url: '../user/user'
                      })
                    }
                  })
                })
              }
            })
          })
        }
      })
    } else {
      // 信息填写不完整的提示
      wx.showToast({
        title: '信息填写不完整',
        icon: 'error',
        duration: 3000
      })
    }

  },

  /**

   * 生命周期函数--监听页面加载
     */
       onLoad: function (options) {

    let startDate = util.formatTime(new Date());//util.formatTime(new Date())会返回当前时间的字符串表示
    let endDate = util.formatDay(5);//til.formatDay(5)会返回当前日期加上5天后的日期字符串
    this.setData({
      start: startDate, // 将起始日期存储在 data 对象的 start 属性中
      end: endDate // 将结束日期存储在 data 对象的 end 属性中
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