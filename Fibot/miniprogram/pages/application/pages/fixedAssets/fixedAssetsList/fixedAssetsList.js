const app = getApp()
const host = app.globalData.requestHost

Page({

  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    fixedAssetList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.loadFixedAsset()
  },

  loadFixedAsset(e){
    var that = this
    const token = app.getToken()
    wx.request({
      url: host +'/FixedAssets',
      data:JSON.stringify({

      }),
      method:"GET",
      header:{
        "Content-Type": 'application/json',
        'Authorization': token
      },
      success(res){
        console.log(res)
        that.setData({
          fixedAssetList:res.data.results
        })
      }
    })
  },

  addFixedAsset(e) {
    wx.navigateTo({
      url: '../newFixedAsset/newFixedAsset',
    })
  }

})