const app = getApp()
const util = require('../../../../utils/util.js')
var inputVal = '';
const host = app.globalData.requestHost
const applicationBase = app.globalData.applicationBase
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    brList:[],
    allbrList:[],
    searchList:[],
    fun:null,
    e: null
  },

  onLoad(options){
    console.log(options)
    this.setData({
      fun:options.fun
    })
    var that = this
    that.getbrList()
    if (options.query){
      console.log("aaa")
      this.setData({
        query: options.query
      })
      var pages = getCurrentPages()
      let prev = pages[pages.length - 2]
      console.log(prev.data)
      if (prev.data.e != null) {
        console.log('判断要搜索')
        that.setData({
          inputValue: prev.data.e.detail.value,
          e: prev.data.e
        }, () => {
          that.inputChange(prev.data.e)
          console.log('search')
        })
        prev.setData({
          searchValue: null
        })
      }
    }
  },
  getbrList(){
    let token = app.getToken()
    if (token) {
      var that = this
      wx.request({
        url: host + '/queryPurchase',
        data: JSON.stringify({
          companyId: app.globalData.companyId
        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
        },
        success(res) {
          console.log(res)
          that.initbrList(res.data.result)
        }
      })
    }
    
  },
  initbrList(brList) {
    var that = this
    wx.cloud.callFunction({
      name: 'convert2pinyin',
      data: {
        jsonStr: JSON.stringify(brList),
        options: {
          field: 'supplierName',
          pinyin: 'pinyin',
        }
      },
      success: res => {
        console.log('添加成功')
        console.log(res)
        var newlist = res.result
        var datelist = []
        var index1
        for (var i in newlist) {
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
          brList: datelist,
          allbrList: datelist,
        })
        if(that.data.query != null){
          that.setData({
            inputVal: that.data.e.detail.value
          })
        }
        // that.initIndex()
      },
      fail: err => {
        console.error('fail')
      },
      complete: res => {
        if(that.data.query){
          console.log(that.data.e)
          that.inputChange(that.data.e)
        }
        
      }
    })
  },
  //TODO 待改
  initIndex(){
    for (var index in this.data.brList) {
      var indexParam = "brList[" + index + "].index"
      this.setData({
        [indexParam]: index
      })
    }
    this.setData({
      brList:this.data.brList,
      allbrList:this.data.brList
    })
  },
  //按日期排序
  sortNumber(a, b) {
    return a.a - b.a
  },
  //计算总价
  calcTotal(list) {
    var total = 0
    for (var i in list) {
      total = total + list[i].price * list[i].number
    }
    return util.twoDecimal(total)
  },
  //判断日期是否在列表内
  ifDateInList(date, list) {
    for (var i in list) {
      var num = parseInt(i) + 1
      if (date == list[i].date) return num
    }
    return false
  },
  inputChange(e) {
    console.log(e)
    var that = this
    if (this.data.query){
      console.log(e.detail.value)
      inputVal = e.detail.value
      that.search(e)
    }
    else{

      this.search(e)
    }
  },
  //TODO 待改
  search(e) {
    console.log(e)
    var that = this
    let searchText = e.detail.value
    if (!searchText) {
      this.setData({
        brList: this.data.allbrList
      })
    }
    searchText = searchText.toLowerCase()
    console.log(searchText)
    let blist = this.data.allbrList
    let buyList = []
    //查日期
    for (var i in blist) {
      if (blist[i].date.indexOf(searchText) != -1) {
        buyList.push(blist[i])
      }
    }
    //查姓名
    var index1
    for (var i in blist) {
      for (var j in blist[i].list) {
        var rlist = blist[i].list[j]
        if (rlist.pinyin.indexOf(searchText) != -1) {
          index1 = that.ifDateInList(rlist.date, buyList)
          if (index1) {
            buyList[index1 - 1].list.push(rlist)
          } else {
            var list = []
            list.push(rlist)
            buyList.push({
              date: rlist.date,
              list: list
            })
          }
        }
      }
    }
    //TODO查商品 还有bug 添加多次
    for (var i in blist) {
      for (var j in blist[i].list) {
        var rlist = blist[i].list[j]
        var ifbreak = false
        for (var l in buyList) {
          for (var m in buyList[l].list) {
            //console.log(rlist.id + ",,," + buyList[l].list[m].id)
            if (rlist.id == buyList[l].list[m].id) {
              ifbreak = true
            }
            //console.log(ifbreak)
          }
        }
        if (ifbreak) {
          break
          //console.log("break")
        }
        for (var k in blist[i].list[j].goodsList) {
          if (rlist.goodsList[k].goodsName.indexOf(searchText) != -1) {
            index1 = that.ifDateInList(rlist.date, buyList)
            if (index1) {
              buyList[index1 - 1].list.push(rlist)
            } else {
              var list = []
              list.push(rlist)
              buyList.push({
                date: rlist.date,
                list: list
              })
            }
          }
        }
      }
    }
    this.setData({
      brList: buyList
    })
  },
  toDetail(e){
    console.log(this.data)
    console.log(e)
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: applicationBase +'/pages/recordInfo/recordInfo?back=buy&id=' + id + '&fun=' + this.data.fun + '&status=' + status
    })
  },
  
})