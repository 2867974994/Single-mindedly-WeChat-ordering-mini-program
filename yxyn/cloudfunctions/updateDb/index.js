// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'cloud1-5glh72tx410dc8c9'
})

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${[year, month, day].map(formatNumber).join('-')}`
}
//当前时间加多少天
const formatDay = day => {
  let nDate = new Date(new Date().getTime()+28800000);
  let nDay = nDate.getDate()+day;
  let nTime = nDate.setDate(nDay);
  let date = new Date(nTime);
  return formatTime(date);
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
//初始化数据库
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  //得到删除日期和添加日期
  let delDate = formatDay(-5);
  let addDate = formatDay(5);
  //return delDate+'||'+addDate

  //增加一条记录
  await db.collection('seat').add({
    data:{
      _id:addDate,
      noon:{},
      night:{}
    }
  })
  //删除一条记录
  await db.collection('seat').doc(delDate).remove()
}