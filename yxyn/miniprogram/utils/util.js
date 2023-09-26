const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${[year, month, day].map(formatNumber).join('-')} `
}
//当前时间加多少天
const formatDay=day=>{
  let nDate=new Date();
  let nDay=nDate.getDate()+day;
  let nTime=nDate.setDate(nDay);
  let date=new Date(nTime);
  return formatTime(date);
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
//Promise函数封装wx.request
//geturl:请求地址
const getData2=(geturl)=>{
  return new Promise((resolve)=>{
    wx.request({
      url: geturl,
      success:(res)=>{
        resolve(res.data)
      }
    })
  })
}

module.exports = {
  formatTime,
  formatDay,
  getData2
}
