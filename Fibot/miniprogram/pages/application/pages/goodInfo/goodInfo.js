
var app = getApp()
const host = app.globalData.requestHost
Page({
  data: {
    backgroundColor : '',
    isDisable:true,
    barcode: "",
    count: "",
    imageList: [],
    name: '',
    gindex: 0,
    uindex: 0,
    unitInfoList: ['个', 'kg', '袋', '瓶', '箱'],
    typeList: ['食品类', '服装类', '鞋帽类', '日用品类', '家具类', '家用电器类', '纺织品类', '五金电料类', '厨具类'],
    sellprice: '',
    standard: '',
    brand: '',
    isChangeImg:false
  },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {
    this.setData({
      backgroundColor: app.globalData.backgroundColor
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.getInformation(options)
  },
  getInformation(e){
    let token = app.getToken()
    if (token) {
      var that = this
      wx.request({
        url: host + '/queryGoods',
        data: JSON.stringify({
          companyId: app.globalData.companyId,
          id: e.id
        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
        },
        success: res => {
          console.log(res)
          var good = res.data.result.goodsList[0]
          var typeList = this.data.typeList
          var unitInfoList = this.data.unitInfoList
          var gindex
          var uindex
          var imageList = []
          imageList[0] = host + '/goodsPic/' + good.photo
          for (var index in typeList) {
            if (good.type == typeList[index]) {
              gindex = index
            }
          }
          console.log("gindex=" + gindex)
          for (var index in unitInfoList) {
            if (good.unitInfo == unitInfoList[index]) {
              uindex = index
            }
          }
          console.log("uindex=" + uindex)
          that.setData({
            id: good.id,
            name: good.name,
            barcode: good.barcode,
            brand: good.brand,
            imageList: imageList,
            photo: good.photo,
            sellprice: good.sellprice,
            gindex: gindex,
            uindex: uindex,
            type: good.type,
            unitInfo: good.unitInfo
          })
        },
        fail: res => {
          console.log(res)
        }

      })
    }
    
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
    let uindex = e.detail.value
    this.setData({
      uindex: uindex,
      unitInfo: this.data.unitInfoList[uindex]
    })
  },
  goodChange(e) {
    let gindex = e.detail.value
    console.log(e)
    this.setData({
      gindex: gindex,
      type: this.data.typeList[gindex]
    })
  },
  barcodeChange(e) {
    console.log(e);
    this.setData({
      barcode: e.detail.value
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
          imageList: tempFilePaths,
          isChangeImg:true
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
  upload(id) {
    let token = app.getToken()
    if (token) {
      var that = this
      if (this.data.isChangeImg) {
        wx.uploadFile({
          url: host + '/pic/upload',
          filePath: this.data.imageList[0],
          name: 'goods',
          formData: {
            id: id
          },
          header: {
            "Content-Type": "application/json",
            'Authorization': token
          },
          success: res => {
            console.log(res)
            that.modify()
          }
        })
      } else {
        that.modify()
      }
    }
    
  },
  delPic(){
    let token = app.getToken()
    if (token) {
      var that = this
      wx.request({
        url: host + '/pic/delete/' + this.data.photo,
        data: JSON.stringify({
          filename: this.data.photo
        }),
        method: "POST",
        header: {
          "Content-Type": "application/json",
          'Authorization': token
        },
        success: res => {
          console.log(res)
          console.log(res.data.success)
          that.upload(this.data.id)
        },
        fail: err => {
          console.log(err)
        }
      })
    }
    
  },
  scanCode: function (event) {
    let that = this
    if(this.data.isDisable==false){
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
          }).then(res1 => {
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
          }).catch(err => {
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
  },
  onSubmit(e){
    var that = this
    if (this.data.isDisable == false) {
      wx.showModal({
        title: '修改',
        content: '确认保存修改信息',
        success: res => {
          if (res.confirm) {
            // 修改商品信息
            if (this.data.isChangeImg) {
              that.delPic()
            }
            that.upload(this.data.id)
          }
        },
        fail: res => {
          console.log("掉起模态框失败")
        }
      })
    }
    this.setData({
      isDisable: !this.data.isDisable
    })
  },
  modify(){
    let token = app.getToken()
    let that = this
    if (token) {
      console.log(this.data)
      wx.request({
        url: host + '/updateGoodsInfo',
        data: JSON.stringify({
          id: that.data.id,
          name: that.data.name,
          sellprice: that.data.sellprice,
          type: that.data.type,
          barcode: that.data.barcode,
          unitInfo: that.data.unitInfo
        }),
        method: "POST",
        header: {
          "Content-Type": "application/json",
          'Authorization': token
        },
        success: res => {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            mask: true
          })
          console.log(res)
        }
      })
    }
  }
})