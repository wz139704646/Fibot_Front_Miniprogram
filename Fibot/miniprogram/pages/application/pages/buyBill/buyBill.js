var app = getApp()
const host = app.globalData.requestHost
const util = require('../../../../utils/util.js')

const initPage = function (page) {
  let date = util.getcurDateFormatString(new Date())
  // 清除buyInfo缓存
  wx.removeStorage({
    key: 'buyInfo',
    success: function (res) {
      console.log('清理buyInfo缓存:')
      console.log(res)
    },
    fail: err => {
      console.log('清理buyInfo缓存失败:')
      console.error(err)
    }
  })
  // 设置日期属性
  page.setData({
    date: date
  })
}

Page({
  data: {
    host: host,
    type: "1",
    buyList: [],
    supplierId:0,
    id:"",
    amountText: '',
    note: ''
  },

  getPayBanks: function () {
    let token = app.getToken()
    let that = this
    if (token) {
      wx.request({
        url: host + '/arap/getBankNames',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        success: res => {
          if (res.statusCode == 555) {
            app.relogin()
          } else if (res.statusCode == 403) {
            wx.showToast({
              title: '无权限获取银行列表',
              icon: 'none',
              duration: 1000
            })
          } else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
            })
          } else {
            that.setData({
              payBanks: res.data.result,
              bank: res.data.result[0]
            })
          }
        }
      })
    }
  },

  onLoad: function(options) {
    initPage(this)
    let token = app.getToken()
    let that = this
    if (token) {
      wx.request({
        url: host + '/arap/getPayMethods',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        success: res => {
          if (res.statusCode == 555) {
            app.relogin()
          } else if (res.statusCode == 403) {
            wx.showToast({
              title: '无权限获取支付方式',
              icon: 'none',
              duration: 1000
            })
          } else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
            })
          } else {
            that.setData({
              payMethods: res.data.result,
              method: res.data.result[0]
            }, () => {
              if (res.data.result[0] != '现金') {
                that.getPayBanks()
              }
            })
          }
        }
      })
    }
  },

  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  addProvider(e) {
    wx.navigateTo({
      url: '../supplierList/supplierList?type=' + this.data.type,
    })
  },
  addGoods(e) {
    try {
      wx.setStorageSync('buyInfo',
        {
          list: this.data.buyList,
          total: this.data.total
        })
    } catch (e) { console.error(e) }
    wx.navigateTo({
      url: '../chooseGood/chooseGood?back=buy',
    })
  },
  onClick(e) {
    this.setData({
      type:e.detail.index + 1
    })
  },
  //生成采购单
  buyBill() {
    // 处理前端采购单数据，发送给后台
    var buyList = []
    var blist = this.data.buyList
    for (let i in blist) {
      buyList.push({
        id: blist[i].id,
        buyNum: blist[i].buyNum,
        name: blist[i].name,
        price:blist[i].sellprice
      })
    }
    let token = app.getToken()
    if(token) {
      let {date, total, payAmount, note, method, bank, buyList} = this.data
      let that = this
      if(!buyList || buyList.length == 0) {
        return
      } else if(payAmount > total) {
        wx.showToast({
          title: '付款金额应小于等于总价',
          icon: 'none',
          mask: true,
          duration: 1000
        })
        return
      } else if (payAmount > 0 && !method) {
        wx.showToast({
          title: '请选择付款方式',
          icon: 'none'
        })
        return
      } else if (payAmount > 0 && method != '现金' && !bank) {
        wx.showToast({
          title: '请选择付款银行',
          icon: 'none'
        })
        return
      }

      wx.request({
        url: host + '/addPurchase',
        data: JSON.stringify({
          companyId: app.globalData.companyId,
          //原来是:this.data.buyList
          purchases: buyList,
          date: that.data.date,
          supplierId: that.data.supplierId
        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json',
          "Authorization": token
        },
        success: res => {
          if(res.statusCode == 555) {
            app.relogin()
          } else if(res.statusCode!=200 || !res.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求出错',
              icon: 'none',
              duration: 1000
            })
          } else {
            // 添加应付
            wx.request({
              url: host + '/arap/addPurchasePay',
              method: 'POST',
              header: {
                "Content-Type": 'application/json',
                "Authorization": token
              },
              data: JSON.stringify({
                purchaseId: res.data.result,
                reason: note
              }),
              success: res2 => {
                console.log('添加应付', res2)
                if(res2.statusCode == 555) {
                  app.relogin()
                } else if(res2.statusCode!=200 || !res2.data.success){
                  wx.showToast({
                    title: res2.data.errMsg || '请求出错',
                    icon: 'none',
                    mask: true,
                    duration: 1000
                  })
                }
              },
              fail: err2 => {
                console.error('添加应付出错', err2)
                wx.showToast({
                  title: '请求出错',
                  icon: 'none'
                })
              }
            })
            // 添加支出
            if(payAmount > 0) {
              // 本次付款金额大于0才添加支出
              let postData = {
                purchaseId: res.data.result,
                amount: payAmount,
                date: date
              }
              if (method != '现金'){
                postData['bankName'] = bank
              }
              wx.request({
                url: host + '/arap/addPayment',
                method: 'POST',
                header: {
                  "Content-Type": 'application/json',
                  "Authorization": token
                },
                data: JSON.stringify(postData),
                success: res3 => {
                  console.log('添加支出', res3)
                  if (res3.statusCode == 555) {
                    app.relogin()
                  } else if (res3.statusCode != 200 || !res3.data.success) {
                    wx.showToast({
                      title: res3.data.errMsg || '请求出错',
                      icon: 'none',
                      mask: true,
                      duration: 1000
                    })
                  }
                },
                fail: err3 => {
                  console.error('添加支出出错', err3)
                  wx.showToast({
                    title: '请求出错',
                    icon: 'none'
                  })
                }
              })
            }
            wx.showModal({
              title: '成功',
              content: '订单提交成功',
              confirmText: '确认',
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  wx.navigateBack({})
                }
              }
            })
          }
        }
      })
    }
  },

  // 输入付款额事件
  onPayAmountInput: function (e) {
    let reg = /^[0-9]+.?[0-9]*$/
    let v = this.data.payAmount || 0
    let { value } = e.detail
    v = value == '' ? 0 : reg.test(value) ? parseFloat(value) : v
    value = (value == '' || reg.test(value)) ? value : this.data.amountText
    this.setData({
      payAmount: v,
      amountText: value
    })
  },

  // 输入备注事件
  onNoteInput: function (e) {
    this.setData({
      note: e.detail.value
    })
  },

  cancelBill(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  MethodChange: function (e) {
    let method = this.data.payMethods[e.detail.value]
    this.setData({
      method
    }, () => {
      if (method != '现金') {
        this.getPayBanks()
      }
    })
  },

  BankChange: function (e) {
    this.setData({
      bank: this.data.payBanks[e.detail.value]
    })
  }
})