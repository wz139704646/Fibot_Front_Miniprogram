const app = getApp()
const util = require('../../../utils/util.js')
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
    let token = app.getToken()
    let that = this
    if(token){
      wx.request({
        url: host + '/querySell',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
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
                field: 'customerName',
                pinyin: 'pinyin'
              }
            }
          }).then(res => {
            // 存储索引列表和所有列表
            console.log(res)
            var newlist = res.result
            var datelist = []
            var index1
            for (let i in newlist) {
              //newlist[i]['index'] = i
              newlist[i]['date'] = newlist[i]['date'].toString().substring(0, 10)
              newlist[i]['sum'] = that.calcTotal(newlist[i].goodsList)
              index1 = that.ifDateInList(newlist[i].date, datelist)
              //console.log(index1)
              if (index1) {
                //console.log("add")
                datelist[index1 - 1].list.push(newlist[i])
              } else {
                var list = []
                list.push(newlist[i])
                datelist.push({
                  date: newlist[i].date,
                  list: list
                })
              }
            }
            datelist.sort(that.sortNumber)
            console.log(datelist)
            that.setData({
              sellList: datelist,
              allList: datelist
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
    }
  },
  //按日期排序
  sortNumber(a, b)
  {
    return a.date - b.date
  },
  //计算总价
  calcTotal(list){
    var total = 0
    for(var i in list){
      total = total + list[i].sumprice
    }
    return util.twoDecimal(total)
  },
  //判断日期是否在列表内
  ifDateInList(date,list){
    for(var i in list){
      var num = parseInt(i)+1
      if(date == list[i].date) return num
    }
    return false
  },
  //判断id是否在列表内
  ifIdInList(id,list){
    for(var i in list){
      for(var j in list[i].list){
        if (id == list[i].id) {
          return true
        }
      }     
    }
    return false
  },
  // 查看销售详情
  toDetail(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../recordInfo/recordInfo?back=sell'+'&id=' + id +'&fun='+this.data.fun
    })
  },
  //搜索TODO
  search: function(e){
    var that = this
    let searchText = e.detail.value
    if(!searchText){
      this.setData({
        sellList:this.data.allList
      })
    }
    searchText = searchText.toLowerCase()
    let slist = this.data.allList
    let sellList = []
    //查日期
    for(var i in slist){
      if(slist[i].date.indexOf(searchText)!=-1){
        sellList.push(slist[i])
      }
    }
    //查姓名
    var index1
    for(var i in slist){
      for(var j in slist[i].list){
        var rlist = slist[i].list[j]
        if(rlist.pinyin.indexOf(searchText)!=-1){
          index1 = that.ifDateInList(rlist.date, sellList)
          if (index1) {
            //console.log("add")
            sellList[index1 - 1].list.push(rlist)
          } else {
            var list = []
            list.push(rlist)
            sellList.push({
              date: rlist.date,
              list: list
            })
          }
        }
      }
    }
    //TODO查商品 还有bug 添加多次
    for(var i in slist){
      for(var j in slist[i].list){
        var rlist = slist[i].list[j]
        var ifbreak = false
        for(var l in sellList){
          for(var m in sellList[l].list){
            console.log(rlist.id + ",,," + sellList[l].list[m].id)
            if(rlist.id == sellList[l].list[m].id){
              ifbreak = true
            }
            console.log(ifbreak)
          }
          
        }
        if(ifbreak){
          break
          console.log("break")
        }
        for(var k in slist[i].list[j].goodsList){
          // if (that.ifIdInList(rlist.id, sellList)){
          //   break
          // }
          if(rlist.goodsList[k].goodsName.indexOf(searchText)!=-1){
            index1 = that.ifDateInList(rlist.date, sellList)
            if (index1) {
              sellList[index1 - 1].list.push(rlist)
            } else {
              var list = []
              list.push(rlist)
              sellList.push({
                date: rlist.date,
                list: list
              })
            }
          }
        }
      }
    }

    this.setData({
      sellList: sellList
    })
  }
})