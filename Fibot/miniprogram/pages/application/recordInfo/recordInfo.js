const app = getApp()
const host = app.globalData.requestHost
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    pname:"",
    storeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
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
    that.initInfo(options)
    if(this.data.fun == "入库")
    that.getStoreList()
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  getStoreList(e){
    wx.request({
      url: host + '/queryWarehouse',
      data: JSON.stringify({
        companyId: app.globalData.companyId,
      }),
      method: "POST",
      header: {
        "Content-Type": 'application/json'
      },
      success: res => {
        wx.showToast({
          title: '已获得仓库列表',
          icon:'none',
          mask: true
        })
        console.log("仓库：")
        console.log(res)
        this.setData({
          storeList:res.data.result
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  initInfo(e){
    var that = this
    var id = e.id
    var back = e.back 
    // 根据返回页面获取请求不同的api
    let api = back == 'sell' ? '/querySellById' : '/queryPurchaseById'
    wx.request({
      url: host + api,
      data: JSON.stringify({
        companyId: app.globalData.companyId,
        id: id
      }),
      method: "POST",
      header: {
        "Content-Type": 'application/json'
      },
      success(res) {
        console.log(res)
        let data = res.data
        let back = that.data.back
        let list = []
        // 处理返回的同一订单的商品信息列表
        // 购货单
        var nameapi
        var id
        var pname=""
        if(back == 'buy'){
          list = data.result
          console.log(list)
          nameapi = "/querySupplierById"
          id = data.result[0].supplierId
          if(list && list.length>0){
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
        else if(back == 'sell') {
          console.log(data)
          list = data.result
          nameapi = "/queryCustomerById"
          id = data.result[0].customerId
          if(list && list.length>0) {
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
            "Content-Type": 'application/json'
          },
          success(res) {
            console.log(res)
            that.setData({
              pname:res.data.result[0].name
            })
          }
        })

        that.setData({
          buyList: list
        })
        that.calTotal(list, back)
      },
      
    })
  },

  delBill(e){
    wx.request({
      url: host + '/delBuy',
      data: JSON.stringify({
        companyId: app.globalData.companyId,
        id:this.data.id

      }),
      method: "POST",
      header: {
        "Content-Type": 'application/json'
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '订单已删除',
          duration:2000,
          mask:true
        })
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面

        //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          brList: res.data.result.brList
        });
        wx.navigateBack({
          delta: 1
        })
      },
      fail:res=>{
        console.log("删除失败")
      }
    })
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
        total = total + list[index].number * list[index].purchasePrice
      }
    } else {
      for(var index in list) {
        total += list[index].sumprice
      }
    }
    this.setData({
      total: total
    })
  },
  //确认入库
  buyArrived(){
    var that = this
    wx.showModal({
      title: '确认入库',
      content: '确认订单' + this.data.id + "入库",
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请求提交中',
            icon:'none',
            mask: true
          })
          that.storeInWareHouse()
        }
      },
      fail: function (err) {
        console.error('调起模态确认框失败', err)
      }
    })
  },
  storeInWareHouse(){
    //入库请求
    wx.request({
      url: host + '/storeInWarehouse',
      data: JSON.stringify({
        companyId: app.globalData.companyId,
        id: this.data.id,
        wareHouseId: this.data.storeList[this.data.index].id
      }),
      method: "POST",
      header: {
        "Content-Type": 'application/json'
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
  },
  //确认出库
  sellOut(){

  }

})