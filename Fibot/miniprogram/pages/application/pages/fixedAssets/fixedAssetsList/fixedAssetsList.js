const app = getApp()
const host = app.globalData.requestHost
var inputVar = ''

Page({

  data: {
    backgroundColor : '',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    fixedAssetList:[]
  },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {
    this.setData({
      backgroundColor: app.globalData.backgroundColor
    })

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
          fixedAssetList:res.data.results,
          allfixedAssetList:res.data.results
        })
      }
    })
  },

  addFixedAsset(e) {
    wx.navigateTo({
      url: '../newFixedAsset/newFixedAsset',
    })
  },

  toDetail(e){
    console.log(e)
    wx.navigateTo({
      url: '../fixedAssetDetails/fixedAssetDetails?item='+JSON.stringify(e.currentTarget.dataset.item),
    })
  },

  search(e){
    var searchText = e.detail.value
    if(!searchText){
      this.setData({
        fixedAssetList: this.data.allfixedAssetList
      })
    }else{
      var fixedAssetList = this.data.allfixedAssetList
      var slist = []
      for (var i in fixedAssetList) {
        if (fixedAssetList[i].asset_name.indexOf(searchText) != -1) {
          slist.push(fixedAssetList[i])
        }
      }
      this.setData({
        fixedAssetList: slist
      })
    } 
  },

  inputChange(e){
    var that = this
    inputVar = e.detail.value
    that.search(e)
  }

})