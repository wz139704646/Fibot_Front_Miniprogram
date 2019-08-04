// pages/application/depositJournal/addJournal/addJournal.js
const app = getApp()
const util = require('../../../../utils/util.js')
const host = app.globalData.requestHost
var date1 = ''
var date2 = ''
var time = ''
var number = ''
var description = ''
var money = ''
var voucher = ''
var bankName = ''
var companyName = app.globalData.companyId
var amount = ''
var clearForm = ''

const initPage = function (page) {
  date1 = util.getcurDateFormatString(new Date())
  date2 = util.getcurDateFormatString(new Date())
  
  var timeStamp = Date.parse(new Date())
  var date = new Date(timeStamp)
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  time = " "+ h + ":" + m + ":" + s
  console.log(time)

  // 设置日期属性
  page.setData({
    date1: date1,
    date2: date2
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,

    way: ['收', '支'],
    objectArray: [
      {
        id: 0,
        name: '收'
      },
      {
        id: 1,
        name: '支'
      }
    ],
    indexOfWay: 0,

    clearForm: ['银付', '银收', '现付', '现收'],
    objectArray: [
      {
        id: 0,
        name: '银付'
      },
      {
        id: 1,
        name: '银收'
      },
      {
        id: 2,
        name: '现付'
      },
      {
        id: 3,
        name: '现收'
      }
    ],
    indexOfClearForm: 0,

  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  onSave1(e) {
    var that = this
    date1 = date1 + time
    console.log(date1)
    if (description == '' || money == '') {
      wx.showModal({
        title: '新增库存现金日记账',
        content: '请填写必要信息',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '确认增加',
        content: '是否确认增加该笔记账',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '请求提交中',
              mask: true
            })
            that.addsuccess1()
          }
        },
        fail: function (err) {
          console.error('添加失败', err)
        }
      })
    }
  },
  //添加成功
  addsuccess1(e) {
    console.log({
      date: date1,
      variation: money,
      changediscreiption: description
    })
    let token = app.getToken()
    if(token) {
      wx.request({
        url: host + '/addCashRecord',
        data: JSON.stringify({
          date: date1,
          variation: money,
          changeDescription: description
        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
      },
        success: res => {
          console.log(res)
          wx.showToast({
            title: 'add success',
          })
          wx.redirectTo({
            url: '/pages/application/depositJournal/journalList/journalList',
          })
        }
      })
    }
  },

  onSave2(e) {
    var that = this
    date2 = date2 + time
    if (voucher == '' || bankName == '' || amount == '') {
      wx.showModal({
        title: '新增银行存款日记账',
        content: '请填写必要信息',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '确认增加',
        content: '是否确认增加该笔记账',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '请求提交中',
              mask: true
            })
            that.addsuccess2()
          }
        },
        fail: function (err) {
          console.error('添加失败', err)
        }
      })
    }
  },
  //添加成功
  addsuccess2(e) {
    console.log({
      voucher: voucher,
      date: date2,
      amount: amount,
      bankName: bankName,
      companyName: companyName,
      clearForm: clearForm[indexOfClearForm]
    })
    wx.request({
      url: host + '/addBankRecord',
      data: JSON.stringify({
        voucher: voucher,
        date: date2,
        amount: amount,
        bankName: bankName,
        companyName: companyName,
        clearForm: clearForm[indexOfClearForm]
      }),
      method: "POST",
      header: {
        "Content-Type": 'application/json'
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: 'add success',
        })
        wx.redirectTo({
          url: '/pages/application/depositJournal/journalList/journalList',
        })
      }
    })
  },

  onList(e) {
    wx.redirectTo({
      url: '/pages/application/depositJournal/journalList/journalList',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initPage(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  Date1Change(e) {
    this.setData({
      date1: e.detail.value 
    })
    console.log(date1)
  },

  Date2Change(e) {
    this.setData({
      date2: e.detail.value
    })
  },

  NumberChange(e) {
      number = e.detail.value
  },

  DescriptionChange(e) {
      description = e.detail.value
  },

  WayChange(e) {
    this.setData({
      indexOfWay: e.detail.value
    })
  },

  MoneyChange(e) {
      money = e.detail.value
  },

  VoucherChange (e) {
      voucher = e.detail.value
  },

  BankNameChange (e) {
      bankName = e.detail.value
  },

  ClearFormChange(e) {
    this.setData({
      indexOfClearForm: e.detail.value
    })
  },

  AmountChange (e) {
      amount = e.detail.value
  }

})