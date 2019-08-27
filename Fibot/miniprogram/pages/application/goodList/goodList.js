const app = getApp()
const host = app.globalData.requestHost

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    goodsList: []
      
  },
  onLoad: function (options) {
    var that = this
    that.initGoodList()
    this.setData({
      host:host
    })
  },
  initGoodList(){
    wx.request({
      url: host + '/queryGoods',
      data: JSON.stringify({
        companyId:app.globalData.companyId
      }),
      method: "POST",
      header: {
        "Content-Type": 'application/json'
      },
      success: res => {
        console.log(res)
        console.log(res.data.result.goodsList)
        this.setData({
          goodsList: res.data.result.goodsList
        })
      }
    })
  },
  navigateToGoodInfo(e){
    console.log(e)
    console.log("查看详情")
    wx.navigateTo({
      url: '/pages/application/goodInfo/goodInfo?name='+e.currentTarget.dataset.name,
    })
  },
  navigateToGoodAnalyse(e){
    console.log(e)
    console.log("查看分析")
  },
})