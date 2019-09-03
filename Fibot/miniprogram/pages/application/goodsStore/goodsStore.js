const app = getApp()
const host = app.globalData.requestHost
var inputVal = ''

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
    let token = app.getToken()
    if (token) {
      var that = this
      wx.request({
        url: host + '/queryStoreGoods',
        data: JSON.stringify({
          companyId: app.globalData.companyId
        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
        },
        success: res => {
          console.log(res)
          console.log(res.data.result.goodsList)
          this.setData({
            goodsList: res.data.result.goodsList
          })
          that.initpyGoodList()
        }
      })
    }
    
  },

  initpyGoodList() {
    var that = this
    wx.cloud.callFunction({
      name: 'convert2pinyin',
      data: {
        jsonStr: JSON.stringify(this.data.goodsList),
        options: {
          field: 'name',
          pinyin: 'pinyin',
          initial: 'firstletter'
        }
      },
      success: res => {
        console.log('添加pinyin成功')
        console.log(res)
        this.setData({
          goodsList: res.result,
          allgoodsList: res.result
        })
      },
      fail: err => {
        console.error('fail')
      }
    })
  },

  showStoreDetails(e){
    console.log("查看库存详情")
    let token = app.getToken()
    if (token) {
      var that = this
      wx.request({
        url: host + '/queryGoodsStoreByGoodsId',
        data: JSON.stringify({
          companyId: app.globalData.companyId,
          goodsId: e.currentTarget.dataset.id
        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
        },
        success: function (res) {
          console.log(res)
          var storeList = res.data.result
          for (var i in storeList) {
            storeList[i]['value'] = storeList[i].wareHouseName + ": " + storeList[i].number
          }
          console.log(storeList)
          that.setData({
            storeList: storeList,
            modalName: 'bottomModal'
          })

        }
      })
    }
    
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  inputChange(e) {
    console.log(e.detail.value)
    inputVal = e.detail.value
  },

  search(e) {
    var that = this
    console.log("正在搜索")
    if (inputVal == "") {
      this.setData({
        goodsList: this.data.allgoodsList
      })
    } else {
      var gList = []
      var goodsList = this.data.allgoodsList
      for (var i = 0; i < goodsList.length; i++) {
        var pinyin = goodsList[i].pinyin
        var name = goodsList[i].name
        if (pinyin.indexOf(inputVal) != -1 || name.indexOf(inputVal) != -1) {
          gList.push(goodsList[i])
        }
      }
      this.setData({
        goodsList: gList
      })
    }
  },

})