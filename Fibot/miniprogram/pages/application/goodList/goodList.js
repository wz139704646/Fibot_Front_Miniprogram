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
          goodList: res.data.result.goodsList
        })
      }
    })

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
          goodList: res.data.result.goodsList
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

  search(e) {
    var that = this
    console.log("正在搜索")
    if (inputVal == "") {
      this.setData({
        goodList: this.data.goodList
      })
    } else {
      this.data.goodList = []
      for (let i = 0; i < this.data.goodList.length; i++) {
        let j = this.data.goodList[i].pinyin
        let k = j.toUpperCase().charCodeAt(0)
        let l = this.data.goodList[i].name
        if (j.indexOf(inputVal) != -1 || l.indexOf(inputVal) != -1) {
          this.data.goodList[k - 65].push(this.data.goodList[i])
        }
      }

      this.setData({
        goodList: this.data.goodList
      });
    }
  },
})