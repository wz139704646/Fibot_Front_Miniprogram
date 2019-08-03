var app = getApp()
const host = app.globalData.requestHost
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    fun:null,
    sellList: [ ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fun: options.fun
    })
    let that = this
    wx.request({
      url: host+'/querySell',
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      data: JSON.stringify({
        companyId: app.globalData.companyId,
      }),
      success: res => {
        // 添加拼音属性
        console.log(res)
        let list = res.data.result
        wx.cloud.callFunction({
          name: 'convert2pinyin',
          data: {
            jsonStr: JSON.stringify(list),
            options: {
              field: 'goodsName',
              pinyin: 'pinyin'
            }
          }
        }).then( res => {
          // 存储索引列表和所有列表
          console.log(res)
          let newlist = res.result
          for(let i in newlist){
            newlist[i]['index'] = i
            newlist[i]['date'] = newlist[i]['date'].toString().substring(0, 10)
          }
          that.setData({
            sellList: newlist,
            allList: newlist
          })
        }).catch(err => {
          console.error(err)
          wx.showToast({
            title: '商品信息出错',
            icon: 'none'
          })
        })
      },
      fail: err1 => {
        console.error(err1)
        wx.showToast({
          title: '加载失败',
          image: '../../../imgs/fail.png'
        })
      }
    })
  },
  // 查看销售详情
  toDetail(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../recordInfo/recordInfo?back=sell'+'&id=' + this.data.allList[index].id+'&fun='+this.data.fun
    })
  },

  search: function(e){
    let searchText = e.detail.value
    if(!searchText || !this.data.allList)
      return
    searchText = searchText.toLowerCase().split(' ').join('')
    timetext = searchText.split('-').join('')
    let slist = this.data.allList
    let sellList = []
    for(var i in slist){
      let gname = slist[i].goodsName
      let cname = slist[i].customerName
      let id = slist[i].id
      let date = slist[i].date.split('-').join('')
      if(gname.toLowerCase().indexOf(searchText)!=-1
      || cname.toLowerCase().indexOf(searchText)!=-1
      || id.indexOf(searchText)!=-1
      || date.indexOf(timetext)!=-1){
        sellList.push(slist[i])
      }
    }
    this.setData({
      sellList: sellList
    })
  }
})