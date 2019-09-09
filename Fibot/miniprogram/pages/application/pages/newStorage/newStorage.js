const app = getApp()
const host = app.globalData.requestHost
var name = ''
var site = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //输入值改变
  nameChange(e) {
    console.log(e.detail.value)
    name = e.detail.value
  },
  siteChange(e) {
    console.log(e.detail.value)
    site = e.detail.value
  },
  //确认添加
  addsuccess(e) {
    let token = app.getToken()
    if (token) {
      wx.request({
        url: host + '/addWarehouse',
        data: JSON.stringify({
          companyId: app.globalData.companyId,
          name: name,
          site: site
        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
        },
        success: res => {
          wx.showToast({
            title: '添加成功',
            duration: 2000,
            icon: "none",
            mask: true
          })
          console.log(res)
          wx.redirectTo({
            url: '/pages/index/index',
          })
        },
        fail: res => {
          wx.showToast({
            title: '添加失败',
            icon: "none",
            mask: true
          })
        }
      })
    }
    
  },
  //取消添加
  addfail(e) {
    wx.navigateBack({})
  },
})