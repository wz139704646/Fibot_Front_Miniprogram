const app = getApp()
const util = require('../../../utils/util.js')
const host = app.globalData.requestHost
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:null,
    pname:"",
    storeList:[],
    isShow:false,
    curOutList:[],
    curStoreList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    this.setData({
      host: host
    })
    if(!options.id || !options.back){
      wx.showToast({
        title: '获取订单信息失败！',
        icon: 'none'
      })
      return
    }
    this.setData({
      id:options.id,
      status:options.status,
      back: options.back,
      fun: options.fun
    })
    let token = app.getToken()
    if(token){
      that.initInfo(options, token)
      if (this.data.fun == "入库") {
        that.getStoreList()
      }  
    }
    
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  getStoreList(token){
    if(token){
      wx.request({
        url: host + '/queryWarehouse',
        data: JSON.stringify({
          companyId: app.globalData.companyId,
        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
        },
        success: res => {
          console.log("已获得仓库列表：")
          console.log(res)
          this.setData({
            storeList: res.data.result
          })
        },
        fail: res => {
          console.log(res)
        }
      })
    }else{
      app.relogin()
    }
    
  },

  initInfo(e,token){
    var that = this
    var id = e.id
    var back = e.back 
    // 根据返回页面获取请求不同的api
    console.log(token)
    let api = back == 'sell' ? '/querySell' : '/queryPurchase'
    if(token){
      wx.request({
        url: host + api,
        data: JSON.stringify({
          companyId: app.globalData.companyId,
          id: id
        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
        },
        success(res) {
          console.log(res)
          let data = res.data
          let back = that.data.back
          // 处理返回的同一订单的商品信息列表
          // 购货单
          var nameapi
          var id
          var pname = ""
          var list = []
          if (back == 'buy') {
            list = data.result
            console.log(list)
            nameapi = "/querySupplierById"
            id = list[0].supplierId
            if (list && list.length > 0) {
              list[0].date = list[0].date.toString().substring(0, 10)
            } else {
              wx.showToast({
                title: '订单号错误',
                image: '../../../imgs/fail.png'
              })
              return
            }
          }
          // 销货单
          else if (back == 'sell') {
            console.log(data)
            list = data.result
            nameapi = "/queryCustomerById"
            id = list[0].customerId
            if (list && list.length > 0) {
              list[0].date = list[0].date.toString().substring(0, 10)
            } else {
              wx.showToast({
                title: '订单号错误',
                image: '../../../imgs/fail.png'
              })
              return
            }
          } else {
            wx.showToast({
              title: '出现未知错误',
              image: '../../../imgs/fail.png'
            })
            return
          }

          wx.request({
            url: host + nameapi,
            data: JSON.stringify({
              companyId: app.globalData.companyId,
              id: id
            }),
            method: "POST",
            header: {
              "Content-Type": 'application/json',
              'Authorization': token
            },
            success(res) {
              console.log(res)
              that.setData({
                pname: res.data.result[0].name,
              })
            }
          })
          that.setData({
            buyList: list[0].goodsList,
            date: list[0].date
          })
          that.calTotal(list[0].goodsList, back)
        },
      })
    }  
  },

  //返回上一页
  backToList(e){
    console.log(e)
    wx.navigateBack({
      delta:1
    })
  },
  //计算总价
  calTotal(list, back) {
    var total = 0
    if(back == 'buy') {
      for (var index in list) {
        total = total + list[index].number * list[index].price
      }
    } else {
      for(var index in list) {
        total += list[index].sumprice
      }
    }
    total = util.twoDecimal(total)
    console.log("total = "+total)
    this.setData({
      total: total
    })
  },
  //确认入库
  buyArrived(){
    var that = this
    if(this.data.index==null){
      wx.showModal({
        title: '提示',
        content: '请选择入库仓库',
        showCancel:false
      })
    }else{
      wx.showModal({
        title: '确认入库',
        content: '确认订单' + this.data.id + "入库",
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '请求提交中',
              icon: 'none',
              mask: true
            })
            that.storeInWareHouse()
          }
        },
        fail: function (err) {
          console.error('调起模态确认框失败', err)
        }
      })
    }
    
  },
  storeInWareHouse(){
    //入库请求
    let token = app.getToken()
    if(token){
      wx.request({
        url: host + '/storeInWarehouse',
        data: JSON.stringify({
          companyId: app.globalData.companyId,
          id: this.data.id,
          wareHouseId: this.data.storeList[this.data.index].id
        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
        },
        success: res => {
          wx.showToast({
            title: '确认入库',
            duration: 2000,
            mask: true
          })
          console.log(res)
          wx.redirectTo({
            url: '/pages/index/index',
          })
        },
        fail: res => {
          console.log(res)
        }
      })
    }else{
      app.relogin()
    }
    
  },
  //确认出库
  sellOut(){
    //TODO
    wx.showToast({
      title: '确认出库',
      duration: 2000,
      mask: true
    })
    console.log(res)
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  //TODO
  chooseWareHouse(e){
    console.log(e)
    if(this.data.back=="sell"&&this.data.fun=="出库"){
      this.setData({
        isShow:true
      })
    }
  },
  chooseFinished(e){
    //TODO 将该商品出库信息添加到outlist中去
    this.setData({
      isShow:false
    })
  },
  showModal(e){
    var that = this
    let token = app.getToken()
    var curItem = e.currentTarget.dataset.item
    var curIndex = e.currentTarget.dataset.index
    console.log(e)
    if(token){
      this.setData({
        isShow: true,
        curItem: curItem,
        curIndex: curIndex
      })
      
      if(!curItem.outlist){
        wx.request({
          url: host + '/queryGoodsStoreByGoodsId',
          data: JSON.stringify({
            companyId: app.globalData.companyId,
            goodsId: curItem.goodsId
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
              curStoreList: storeList,
            })
          }
        })
      }else{
        that.setData({
          curStoreList: curItem.outlist,
        })
      }
      
    }   
  },
  hideModal(e){
    this.setData({
      isShow:false
    })
  },
  numberChange(e){
    console.log(e)
    var index = e.currentTarget.dataset.index
    var curStoreList = this.data.curStoreList
    curStoreList[index]['storeNum'] = e.detail.value
    this.setData({
      curStoreList: curStoreList
    })
  },
  confirmModal(e){
    var curItem = this.data.curItem
    var curIndex = this.data.curIndex
    var curStoreList = this.data.curStoreList
    var buyList = this.data.buyList
    buyList[curIndex]['outlist'] = curStoreList
    this.setData({
      buyList:buyList,
      isShow:false
    })
    console.log(buyList)
  }
})