var app = getApp()
const host = app.globalData.requestHost
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor : '',
    barcode:"",
    count:"",
    imageList: [],
    name:'',
    gindex: 0,
    uindex: 0,
    unitInfo: ['个', 'kg', '袋', '瓶', '箱'],
    type: ['食品类','服装类','鞋帽类','日用品类','家具类','家用电器类','纺织品类','五金电料类','厨具类','其他类'],
    sellprice: '',
    standard: '',
    brand: ''
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      backgroundColor: app.globalData.backgroundColor
    })

  },

  nameChange(e) {
    console.log(e);
    this.setData({
      name: e.detail.value
    })
  },
  sellpriceChange(e) {
    this.setData({
      sellprice: e.detail.value
    })
  },
  unitChange(e) {
    console.log(e);
    this.setData({
      uindex: e.detail.value
    })
  },
  goodChange(e) {
    console.log(e);
    this.setData({
      gindex: e.detail.value
    })
  },
  barcodeChange(e){
    console.log(e);
    this.setData({
      barcode: e.detail.value
    })
  },
  onSubmit(e) {
    var that = this
    console.log(this.data)
    if (this.data.name == '' || this.data.imageList.length == 0 || this.data.barcode == '' || this.data.sellprice == '') {
      wx.showModal({
        title: '新增货物',
        content: '请填写必要信息',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '确认添加',
        content: '是否确认添加商品' + this.data.name,
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '请求提交中',
              mask: true
            })
            that.addsuccess()
          }
        },
        fail: function (err) {
          console.error('调起模态确认框失败', err)
        }
      })
    }
  },
  addsuccess(e){
    let token = app.getToken()
    if (token) {
      var that = this
      wx.request({
        url: host + '/addGoods',
        data: JSON.stringify({
          companyId: app.globalData.companyId,
          name: this.data.name,
          sellprice: this.data.sellprice,
          type: this.data.type[this.data.gindex],
          unitInfo: this.data.unitInfo[this.data.uindex],
          barcode: this.data.barcode

        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
        },
        success: res => {
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: '3000',
            mask: true
          })
          that.upload(res)
          console.log(res.data)
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
      })
    }
    

  },
  addfail(e){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  chooseImage: function (event) {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePaths = res.tempFilePaths
        this.setData({
          imageList: tempFilePaths
        })
        console.log(res)
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  upload(e){
    console.log(e.data.result.id)
    wx.uploadFile({
      url: host + '/pic/upload',
      filePath: this.data.imageList[0],
      name: 'goods',
      formData:{
        id:e.data.result.id
      },
      success: result => {
        console.log(result)

      }
    })
  },
  scanCode: function (event) {
    let that = this
    wx.scanCode({
      success: res => {
        // console.log(typeof(res.result))
        // 查询商品信息
        wx.showLoading({
          title: '查询商品信息中',
          mask: true
        })
        wx.cloud.callFunction({
          name: 'barcode2info',
          data: {
            barcode: res.result
          }
        }).then( res1 => {
          wx.hideLoading()
          console.log(res1)
          let info = res1.result
          if (info.code == 1) {
            that.setData({
              name: info.data.goodsName,
              barcode: info.data.barcode,
              sellprice: info.data.price,
              standard: info.data.standard,
              brand: info.data.brand
            })
          } else if (info.code == 0) {
            that.setData({
              barcode: res.result
            })
          }
        }).catch( err => {
          wx.hideLoading()
          console.error(err)
          that.setData({
            barcode: res.result
          })
        })
      },
      fail: err1 => {
        console.error(err1)
      }
    })
  }
})