const app = getApp()
const util = require('../../../utils/util.js')
var inputVal = '';
const host = app.globalData.requestHost
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    brList:[],
    allbrList:[],
    searchList:[],
    fun:null
  },
  onLoad(options){
    console.log(options)
    this.setData({
      fun:options.fun
    })
    var that = this
    that.getbrList()
  },
  getbrList(){
    var that = this
    wx.request({
      url: host + '/queryPurchase',
      data: JSON.stringify({
        companyId: app.globalData.companyId
      }),
      method: "POST",
      header: {
        "Content-Type": 'application/json'
      },
      success(res){
        console.log(res)
        that.initbrList(res.data.result)
      }
    })
  },
  initbrList(brList) {
    var that = this
    wx.cloud.callFunction({
      name: 'convert2pinyin',
      data: {
        jsonStr: JSON.stringify(brList),
        options: {
          field: 'goodName',
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
          allbrList: datelist
        })
        // that.initIndex()

      },
      fail: err => {
        console.error('fail')
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
    var that = this
    console.log(e.detail.value)
    inputVal = e.detail.value
    that.search()
  },
  //TODO 待改
  search() {
    var that = this
    console.log("正在搜索")
    this.setData({
      brList: this.data.allbrList
    })
    if (inputVal == "") {
      console.log("无操作")
    } else {
      this.data.searchList = []
      for (let i = 0, len = this.data.brList.length; i < len; i++) {
        let j = this.data.brList[i].pinyin
        let l = this.data.brList[i].date
        if (j.indexOf(inputVal) != -1 || l.indexOf(inputVal) != -1) {
          this.data.searchList.push(this.data.brList[i])
        }
      }
      this.setData({
        brList: this.data.searchList
      });
    }
  },
  toDetail(e){
    console.log(this.data)
    console.log(e)
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../recordInfo/recordInfo?back=buy&id=' + this.data.allbrList[index].id + '&fun=' + this.data.fun + '&status=' + this.data.allbrList[index].status
    })
  },
  
})