const app = getApp()
const host = app.globalData.requestHost

Page({

  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      fixedAsset:JSON.parse(options.item)
    })

  },
})