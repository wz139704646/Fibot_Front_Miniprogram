const app = getApp()
const host = app.globalData.requestHost
var inputVal = '';

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    goodList: [],
  },
  onLoad: function (options) {
    var that = this
    that.initGoodList()
    this.setData({
      host:host
    })
  },

  initGoodList(){
    var that = this
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
          goodList:res.data.result.goodsList
        })
        that.initpyGoodList()
      }
    })
  },

  initpyGoodList(){
    var that = this
    wx.cloud.callFunction({
      name: 'convert2pinyin',
      data: {
        jsonStr: JSON.stringify(this.data.goodList),
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
          goodList: res.result,
          allgoodList:res.result
        })
      },
      fail: err => {
        console.error('fail')
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

  inputChange(e) {
    console.log(e.detail.value)
    inputVal = e.detail.value
  },

  search(e) {
    var that = this
    console.log("正在搜索")
    if (inputVal == "") {
      this.setData({
        goodList: this.data.allgoodList
      })
    } else {
      var gList = []
      var goodList = this.data.allgoodList
      for (var i = 0; i < goodList.length; i++) {
        var pinyin = goodList[i].pinyin
        var name = goodList[i].name
        if (pinyin.indexOf(inputVal) != -1 || name.indexOf(inputVal) != -1) {
          gList.push(goodList[i])
        }
      }
      this.setData({
        goodList: gList
      })
    }
  },
})