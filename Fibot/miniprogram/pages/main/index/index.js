const app = getApp()
const host = app.globalData.requestHost
const applicationBase = app.globalData.applicationBase

Page({
  data: {
    PageCur: 'accounting',
    imgBase: app.globalData.imgBase
  },

  // 页面加载函数
  onLoad: function(options) {
    if(options.role){
      this.setData({
        PageCur:options.role
      })
    }
    // 获取用户信息，如果没有登录则转入登录页面
    let that = this
    console.log("onload")
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let token = app.getToken()
    console.log(token)
    if(!token) {
      wx.hideLoading()
    } else {
      wx.request({
        url: host + '/decodeToken',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: JSON.stringify({
          token: token
        }),
        success: res => {
          console.log(res)
          wx.hideLoading()
          if(res.statusCode!=200 || !res.data.success || !res.data.result || res.data.result.length==0) {
            wx.showToast({
              title: res.data.errMsg || '请求错误',
              icon: 'none',
              duration: 1000
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '../login/login',
              })
            }, 1000)
          } else {
            
            let {account, companyId, position} = res.data.result[0]
            app.globalData.account = account
            app.globalData.companyId = companyId
            app.globalData.position = position
          }
        },
        fail: err => {
          console.error('请求失败',err)
          wx.redirectTo({
            url: '../login/login',
          })
        }
      })
    }
    // 原版对微信绑定的检查
    // wx.getSetting({
    //   success: res => {
    //     console.log("get setting suc")
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: res2 => {
    //           console.log('get userinfo suc')
    //           app.globalData.userInfo = res2.userInfo
    //           wx.cloud.callFunction({
    //             name: 'login',
    //             data: {
    //               cloudID: wx.cloud.CloudID(res2.cloudID)
    //             }
    //           }).then(suc => {
    //             if (!suc.result.errMsg) {
    //               app.globalData.openid = suc.result.openid
    //               console.log('get openid suc')
    //               wx.request({
    //                 url: host + '/queryUser',
    //                 method: 'POST',
    //                 header: {
    //                   "Content-Type": 'application/json'
    //                 },
    //                 data: JSON.stringify({
    //                   openid: suc.result.openid
    //                 }),
    //                 success: rs => {
    //                   console.log('query user suc')
    //                   console.log(rs)
    //                   if (!rs.data.success) {
    //                     if (account == undefined) {
    //                       wx.redirectTo({
    //                         url: '../login/login',
    //                         complete: () => {
    //                           wx.hideToast()
    //                         }
    //                       })
    //                     }
    //                   } else {
    //                     if (!account) {
    //                       app.globalData.companyId = rs.data.result[0].companyId
    //                       app.globalData.account = rs.data.result[0].account
    //                     }
    //                     // position 后期加到 gloablData 里
    //                   }
    //                 },
    //                 fail: err1 => {
    //                   if (account == undefined) {
    //                     wx.redirectTo({
    //                       url: '../login/login',
    //                       complete: () => {
    //                         wx.hideToast()
    //                       }
    //                     })
    //                   }
    //                 }
    //               })
    //             }
    //           }).catch(err2 => {
    //             console.error(err2)
    //             if (account == undefined) {
    //               wx.redirectTo({
    //                 url: '../login/login',
    //                 complete: () => {
    //                   wx.hideToast()
    //                 }
    //               })
    //             }
    //           })
    //         },
    //         fail: err => {
    //           if (account == undefined) {
    //             wx.redirectTo({
    //               url: '../login/login',
    //               complete: () => {
    //                 wx.hideToast()
    //               }
    //             })
    //           }
    //         }
    //       })
    //     } else {
    //       if (account == undefined) {
    //         wx.redirectTo({
    //           url: '../login/login',
    //           complete: () => {
    //             wx.hideToast()
    //           }
    //         })
    //       }
    //     }
    //   },
    //   fail: err3 => {
    //     if (account == undefined) {
    //       wx.redirectTo({
    //         url: '../login/login',
    //         complete: () => {
    //           wx.hideToast()
    //         }
    //       })
    //     }
    //   }
    // })
  },

  NavChange(e) {
    console.log("navigate change")
    console.log(e)
    var PageLast = this.data.PageLast
    if(PageLast){
      this.setData({
        PageCur: PageLast
      })
    }  
  },
  NavChangeToMy(e){
    this.setData({
      PageLast: this.data.PageCur,
      PageCur: 'my'
    })
  },
  onShareAppMessage() {
    return {
      title: '财务机器人',
      imageUrl: '/images/share.jpg',
      path: '/pages/main/login/login'
    }
  },
  NavToTalk() {
    wx.navigateTo({
      url: applicationBase +'/pages/start/start',
    })
    console.log("navigate")
  },

  drawDiagram: function (year = 0, month = 0) {
    console.log("draw")
    var token = app.getToken()
    wx.request({
      url: host + '/data/getTotalOperatingIncome',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      success: res => {
        arr = []
        for (var k in res.data.result) {
          arr.push({
            name: k,
            data: res.data.result[k]
          });
          console.log(arr)
        }
        pieChart1 = new wxCharts({
          animation: true,
          canvasId: 'pieCanvas1',
          type: 'pie',
          series: arr,
          width: windowWidth,
          height: 300,
          dataLabel: true,
        });
      },
      fail: res => {
        console.error("未成功获取到营业支出数据")
      },
      complete: res => {

      }
    })
  }
})