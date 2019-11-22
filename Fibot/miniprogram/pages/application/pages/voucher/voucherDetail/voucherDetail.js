// miniprogram/pages/application/voucher/voucherDetail/voucherDetail.js
const app = getApp()
const host = app.globalData.requestHost

Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor : '',
    voucherImgBase: host+'/finance/voucherPic/',
    curAtt: 0,
    attachments: []
  },

  getAttachments: function(voucher_no){
    let token = app.getToken()
    let that = this
    if (token) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: host + '/finance/voucher/getAttachment',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: {
          voucher_no
        },
        success: res => {
          if (res.statusCode == 555) {
            app.relogin()
          } else if (res.statusCode == 403) {
            wx.showToast({
              title: '无权限查看',
              icon: 'none',
              duration: 1000
            })
          } else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
            })
          } else {
            let forVoucher = 0
            for (let att of res.data.result){
              if (att.for_voucher == 1) {
                forVoucher += 1
              }
            }
            if (forVoucher == 0){
              wx.showToast({
                title: '未找到凭证图片，点击右上角重新生成',
                icon: 'none',
                duration: 3000
              })
            }
            that.setData({
              attachments: res.data.result,
              forVoucher
            })
          }
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      voucher_no: options.voucher_no
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      backgroundColor: app.globalData.backgroundColor
    })
    this.getAttachments(this.options.voucher_no) 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  onScrollImage: function(e) {
    let scrollHeight = e.detail.scrollHeight
    let itemHeight = scrollHeight / this.data.attachments.length
    let scrollTop = e.detail.scrollTop
    let curAtt = Math.round(scrollTop / itemHeight)
    this.setData({curAtt})
  },

  onBack: function(e) {
    wx.navigateBack({})
  },

  onGenerate: function(e) {
    let token = app.getToken()
    let that = this
    if(token) {
      wx.showLoading({
        title: '重新生成中',
        mask: true
      })
      wx.request({
        url: host + '/finance/voucher/genVoucher',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: {
          voucher_no: that.data.voucher_no
        },
        success: res => {
          if (res.statusCode == 555) {
            app.relogin()
          } else if (res.statusCode == 403) {
            wx.showToast({
              title: '无权限生成凭证图片',
              icon: 'none',
              duration: 1000
            })
          } else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
            })
          } else {
            that.getAttachments(this.data.voucher_no)
          }
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    }
  },

  openModal: function(e){
    this.setData({
      showModal: !this.data.showModal
    })
  },

  hideModal: function(e) {
    this.setData({
      showModal: false
    })
  },

  // previewImage: function(e) {
  //   let {attachments, curAtt} = this.data
  //   let urls = []
  //   for(let att of attachments){
  //     urls.push(att.attachment_url)
  //   }
  //   wx.previewImage({
  //     urls: urls,
  //     current: urls[curAtt]
  //   })
  // },

  onImageTapped: function(e){
    let idx = e.currentTarget.dataset.idx
    this.setData({
      curAtt: idx
    })
  }
})