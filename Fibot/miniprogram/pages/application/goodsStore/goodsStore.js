const app = getApp()
const host = app.globalData.requestHost

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    goodsList: [],
    storeList:[]

  },
  onLoad: function (options) {
    var that = this
    that.initGoodList()
    this.setData({
      host: host
    })
  },
  initGoodList() {
    wx.request({
      url: host + '/queryStoreGoods',
      data: JSON.stringify({
        companyId: app.globalData.companyId
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
  showStoreDetails(e){
    console.log("查看库存详情")
    var that = this
    wx.request({
      url: host + '/queryGoodsStoreByGoodsId',
      data:JSON.stringify({
        companyId:app.globalData.companyId,
        goodsId:e.currentTarget.dataset.id
      }),
      method:"POST",
      header:{
        "Content-Type": 'application/json'
      },
      success:function(res){
        console.log(res)
        var storeList = res.data.result
        for(var i in storeList){
          storeList[i]['value'] = storeList[i].wareHouseName + ": " + storeList[i].number
        }
        console.log(storeList)
        that.setData({
          storeList:storeList,
          modalName: 'bottomModal'
        })

      }
    })
  },
  // showModal(e) {
  //   this.setData({
  //     modalName: 'bottomModal'
  //   })
  // },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
})