var app = getApp()
const host = app.globalData.requestHost
var name = ''
var phone = ''
var bankaccount = ''
var bankname = ''
var taxpayernumber = ''
var site = ''

Page({
  data: {
    type:["批发"]
  },
  //确认添加
  addsuccess(e) {
    wx.request({
      url: host + '/addSupplier',
      data: JSON.stringify({
        companyId: "5",
        name: name,
        phone: phone,
        bankaccount: bankaccount,
        bankname: bankname,
        taxpayerNumber:taxpayernumber,
        site:site

      }),
      method: "POST",
      header: {
        "Content-Type": 'application/json'
      },
      success: res => {
        wx.showToast({
          title: 'add success',
        })
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    })
  },
  //取消添加
  addfail(e) {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  //一系列输入框的valuechange
  nameChange(e) {
    console.log(e.detail.value)
    name = e.detail.value
  },
  phoneChange(e) {
    console.log(e.detail.value)
    phone = e.detail.value
  },
  bankaccountChange(e) {
    console.log(e.detail.value)
    bankaccount = e.detail.value
  },
  banknameChange(e) {
    console.log(e.detail.value)
    bankname = e.detail.value
  },
  taxpayernumberChange(e) {
    console.log(e.detail.value)
    taxpayernumber = e.detail.value
  },
  siteChange(e) {
    console.log(e.detail.value)
    site = e.detail.value
  },
  typeChange(e) {
    this.setData({
      tindex: e.detail.value
    })

  },
})