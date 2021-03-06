// pages/application/sellBill/sellBill.js
const app = getApp()
const util = require('../../../../utils/util.js')
const host = app.globalData.requestHost

const initPage = function(page){
  let date = util.getcurDateFormatString(new Date())
  // 清除buyInfo缓存
  wx.removeStorage({
    key: 'buyInfo',
    success: function(res) {
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
    date: date,
    payAmount: 0,
    amountText: '0'
  })
}

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    host: host,
    backgroundColor :''
  },

  getPayBanks: function() {
    let token = app.getToken()
    let that = this
    if(token) {
      wx.request({
        url: host +'/arap/getBankNames',
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
    initPage(this)
    let token = app.getToken()
    let that = this
    if(token) {
      wx.request({
        url: host +'/arap/getPayMethods',
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
              title: '无权限获取收款方式',
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
            },() => {
              if(res.data.result[0] != '现金'){
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

  addCustomer: function(e) {
    wx.navigateTo({
      url: '../customerList/customerList?back=sell',
    })
  },

  addGoods: function(e) {
    // 缓存记录已买的商品
    try { 
      wx.setStorageSync('buyInfo', 
      {
        list: this.data.buyList,
        total: this.data.total
      })
    } catch(e) {console.error(e)}
    wx.navigateTo({
      url: '../chooseGood/chooseGood?back=sell',
    })
  },

  submitBill: function(e) {
    let token = app.getToken()
    if(token) {
      let that = this
      let slist = this.data.buyList
      let { total, payAmount, method, bank } = this.data
      if (!slist || slist.length == 0)
        return
      else if (payAmount > total) {
        wx.showToast({
          title: '收款金额应小于等于总价',
          icon: 'none'
        })
        return
      } else if(payAmount>0 && !method){
        wx.showToast({
          title: '请选择收款方式',
          icon: 'none'
        })
        return
      } else if(payAmount>0 && method!='现金' && !bank){
        wx.showToast({
          title: '请选择收款银行',
          icon: 'none'
        })
        return
      }

      // 处理前端销售单数据，发送给后台
      let goodsList = []
      for (let i in slist) {
        goodsList.push({
          goodsId: slist[i].id,
          number: slist[i].buyNum,
          sumprice: slist[i].buyNum * slist[i].sellprice
        })
      }
      console.log(goodsList)
      wx.request({
        url: host + '/addSell',
        method: 'POST',
        header: {
          "Content-Type": 'application/json',
          "Authorization": token
        },
        data: JSON.stringify({
          companyId: app.globalData.companyId,
          customerId: that.data.customer.id,
          date: that.data.date,
          goodsList: goodsList
        }),
        success: res => {
          if(res.statusCode == 555){
            app.relogin()
          }
          else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求失败',
              icon: 'none'
            })
          } else {
            // 添加应收
            wx.request({
              url: host + '/arap/addSellReceive',
              method: 'POST',
              header: {
                "Content-Type": 'application/json',
                "Authorization": token
              },
              data: JSON.stringify({
                sellId: res.data.result,
                reason: that.data.note
              }),
              success: res2 => {
                console.log('添加应收', res2)
                if(res2.statusCode == 555) {
                  app.relogin()
                }
                else if (res2.statusCode != 200 || !res2.data.success) {
                  wx.showToast({
                    title: res2.data.errMsg || '请求出错',
                    icon: 'none'
                  })
                }
              },
              fail: err2 => {
                console.error('添加应收出错', err2)
                wx.showToast({
                  title: '请求出错',
                  icon: 'none'
                })
              }
            })
            // 收款金额大于0 添加收款
            if(that.data.payAmount > 0){
              let postData = {
                sellId: res.data.result,
                amount: that.data.payAmount,
                date: that.data.date,
                clearForm: method
              }
              if (method!='现金'){
                postData['bankName'] = that.data.bank
              }
              wx.request({
                url: host + '/arap/addReceive',
                method: 'POST',
                header: {
                  'Content-Type': 'application/json',
                  'Authorization': token
                },
                data: JSON.stringify(postData),
                success: res3 => {
                  console.log('添加收款', res3)
                  if (res3.statusCode == 555) {
                    app.relogin()
                  }
                  else if (res3.statusCode != 200 || !res3.data.success) {
                    wx.showToast({
                      title: res3.data.errMsg || '请求出错',
                      icon: 'none'
                    })
                  }
                },
                fail: err3 => {
                  console.error('添加收入出错', err3)
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
  onPayAmountInput: function(e) {
    let reg = /^[0-9]+.?[0-9]*$/
    let v = this.data.payAmount || 0
    let {value} = e.detail
    v = value=='' ? 0 : reg.test(value) ? parseFloat(value) : v
    value = (value=='' || reg.test(value)) ? value : this.data.amountText
    this.setData({
      payAmount: v,
      amountText: value
    })
  },

  // 输入备注事件
  onNoteInput: function(e) {
    this.setData({
      note: e.detail.value
    })
  },

  // 取消订单，回到首页
  cancelBill() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  MethodChange: function(e) {
    let method = this.data.payMethods[e.detail.value]
    this.setData({
      method
    }, () => {
      if (method != '现金'){
        this.getPayBanks()
      }
    })
  },

  BankChange: function(e) {
    this.setData({
      bank: this.data.payBanks[e.detail.value]
    })
  }
})