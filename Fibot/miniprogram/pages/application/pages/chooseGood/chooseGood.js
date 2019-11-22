const app = getApp()
const host = app.globalData.requestHost
const util = require('../../../../utils/util.js')
var inputVal = ""
Page({
  data: {
    backgroundColor : '',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,

    carts: [],
    hasList: true,
    selectAllStatus: false,
    isShowBuyList: false,

    goodsList: [],
    buyList: [],
    badge: 0,
    total: 0.00,
    back: null,
    searchList: []
  },

  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {
    this.setData({
      backgroundColor: app.globalData.backgroundColor
    })

  },

  onLoad: function(options) {
    console.log("load")
    var that = this
    var goodsList = this.data.goodsList
    this.setData({
      host: host,
      back: options.back
    })
    that.initGoodList()
    wx.getStorage({
      key: 'buyInfo',
      success: function(res) {
        console.log('获取buyInfo成功')
        if (res.data && res.data.list && res.data.list.length != 0) {
          let len = res.data.list.length
          that.setData({
            buyList: res.data.list,
            badge: len,
            total: res.data.total
          })
        } else {
          console.log('buyInfo 为空')
        }
      },
      fail: err => {
        console.log('获取buyInfo失败')
        console.error(err)
      }
    })
  },
  initGoodList() {
    let token = app.getToken()
    if (token) {
      var that = this
      wx.request({
        url: host + '/queryGoods',
        data: JSON.stringify({
          companyId: app.globalData.companyId
        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
        },
        success: res => {
          var goodsList = res.data.result.goodsList
          console.log(goodsList)
          if (this.data.back == 'buy') {
            for (var index in goodsList) {
              goodsList[index].sellprice = 0
            }
          }
          for (var i in goodsList) {
            goodsList[i].sellprice = util.twoDecimal(goodsList[i].sellprice)
          }
          this.setData({
            goodsList: goodsList,
            allgoodsList: goodsList
          })
          that.initNum(goodsList)
        }
      })
    }
  },
  initNum(goodsList) {
    console.log(goodsList)
    for (var index in goodsList) {
      var buyParam = "goodsList[" + index + "].buyNum"
      var indexParam = "goodsList[" + index + "].index"
      this.setData({
        [buyParam]: 0,
        [indexParam]: index
      })
    }
    console.log(this.data.goodsList)
  },
  //显示购物车
  showBuyList(e) {
    if (e.currentTarget.dataset.target == "showBuyList") {
      this.setData({
        isShowBuyList: true,
        goodsList: this.data.buyList
      })
    } else {
      this.setData({
        isShowBuyList: false,
        goodsList: this.data.allgoodsList
      })
    }

  },

  //选择完毕
  finishChoosing(e) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    console.log(this.data.buyList)
    //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      buyList: currPage.data.buyList,
      total: currPage.data.total
    });
    wx.navigateBack({
      delta: 1
    })
  },

  sInputChange(e) {
    inputVal = e.detail.value
    var that = this
    that.search()
  },

  search(e) {
    var that = this
    console.log("正在搜索")
    this.setData({
      goodsList: this.data.allgoodsList
    })
    if (inputVal == "") {
      console.log("无操作")
    } else {
      console.log("有参数")
      this.data.searchList = []
      var j = 0
      for (var i = 0, len = this.data.goodsList.length; i < len; i++) {
        var name = this.data.goodsList[i].name
        if (name.indexOf(inputVal) != -1) {
          this.data.searchList.push(this.data.goodsList[i])
          console.log("is in")
        }
      }
      console.log("setdata")
      this.setData({
        goodsList: this.data.searchList
      });
    }
  },

  selectList(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var goodsList = this.data.goodsList;
    var selected = goodsList[index].selected;
    console.log(goodsList)
    goodsList[index].selected = !selected;
    this.setData({
      goodsList: goodsList
    });
    that.getTotalPriceABuyList();
    that.calcBadge()
  },

  selectAll(e) {
    var that = this
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let goodsList = this.data.goodsList;

    for (let i = 0; i < goodsList.length; i++) {
      goodsList[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      goodsList: goodsList
    });
    that.getTotalPriceABuyList();
    that.calcBadge()
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    console.log("addCount")
    var that = this
    const index = e.currentTarget.dataset.index
    var goodsList = this.data.goodsList
    var allgoodsList = this.data.allgoodsList
    var badge = this.data.badge
    goodsList[index].buyNum += 1
    console.log(goodsList[0])
    console.log(allgoodsList[0])
    //allgoodsList[index].buyNum += 1 
    this.setData({
      goodsList: goodsList,
      //allgoodsList:allgoodsList
    });
    that.getTotalPriceABuyList();
    that.calcBadge()
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    console.log("minusCount")
    var that = this
    var index = e.currentTarget.dataset.index;
    var goodsList = this.data.goodsList;
    var allgoodsList = this.data.allgoodsList
    var buyNum = goodsList[index].buyNum;
    if (buyNum < 1) {
      return false;
    }
    buyNum = buyNum - 1
    goodsList[index].buyNum = buyNum
    console.log(goodsList[0])
    console.log(allgoodsList[0])
    //allgoodsList[index].buyNum -= 1
    this.setData({
      goodsList: goodsList,
      allgoodsList: allgoodsList
    });
    that.getTotalPriceABuyList()
    that.calcBadge()
  },

  /**
   * 计算总价
   */
  getTotalPriceABuyList() {
    let goodsList = this.data.goodsList;
    var buyList = []
    let total = 0;
    for (let i = 0; i < goodsList.length; i++) {
      if (goodsList[i].selected && goodsList[i].buyNum > 0) {
        buyList.push(goodsList[i])
        total += goodsList[i].buyNum * goodsList[i].sellprice;
      }
    }
    this.setData({
      buyList: buyList,
      total: total.toFixed(2)
    })
  },
  //计算徽章
  calcBadge() {
    var badge = 0
    var goodsList = this.data.goodsList
    for (var i in goodsList) {
      if (goodsList[i].selected && goodsList[i].buyNum > 0 && goodsList[i].sellprice > 0) {
        badge = badge + 1
      }
    }
    this.setData({
      badge: badge
    })
  },

  showModal(e) {
    console.log(e)
    this.setData({
      modalName: 'bottomModal',
      curItem: e.currentTarget.dataset.item
    })
  },
  hideModal(e){
    var that = this
    this.setData({
      modalName:null
    })
    that.getTotalPriceABuyList();
    that.calcBadge()
  },

  previewImage: function (e) {
    var current = e.target.dataset.src
    var imageList = []
    imageList.push(current)
    wx.previewImage({
      current: current,
      urls: imageList
    })
  },

  sellpriceChange(e){
    console.log(e.detail.value)
    var index = this.data.curItem.index
    var goodsList = this.data.goodsList
    var sellprice = e.detail.value
    if(sellprice==null||sellprice<0){
      sellprice = 0
    }
    goodsList[index].sellprice = sellprice
    this.setData({
      goodsList:goodsList
    })
  },

  buyNumChange(e){
    console.log(e.detail.value)
    var index = this.data.curItem.index
    var goodsList = this.data.goodsList
    var buyNum = e.detail.value
    if(buyNum<0||buyNum==null){
      buyNum = 0
    }
    goodsList[index].buyNum = buyNum
    this.setData({
      goodsList: goodsList
    })
  }

})