const app = getApp()
const host = app.globalData.requestHost
const applicationBase = app.globalData.applicationBase
const position = app.globalData.position

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    imgBase: app.globalData.imgBase,
    roleName: "",
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    logoutModal: false, 
    companyName: "",
    
  },
  attached() {
    this.setData({
      roleName:app.globalData.position,
      companyName:app.globalData.companyName
    })
    console.log("success")
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let i = 0;
    numDH();
    function numDH() {
      if (i < 20) {
        setTimeout(function () {
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          })
          i++
          numDH();
        }, 20)
      } else {
        that.setData({
          starCount: that.coutNum(3000),
          forksCount: that.coutNum(484),
          visitTotal: that.coutNum(24000)
        })
      }
    }
    wx.hideLoading()
  },
  methods: {
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },
   
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },

    // 绑定微信号
    bindWX: function(e) {
      // 获取用户账号和token
      let account = app.globalData.account
      let token = app.getToken()
      if (!token || !account) {
        wx.showToast({
          title: '登录超时',
          icon: 'none',
          duration: 1000,
          success: () => {
            setTimeout(()=>{
              wx.redirectTo({
                url: '/pages/main/login/login',
              })
            }, 1000)
          }
        })
      } else {
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              // 获取用户openid
              wx.getUserInfo({
                success: res2 => {
                  console.log('get userinfo suc')
                  app.globalData.userInfo = res2.userInfo
                  wx.cloud.callFunction({
                    name: 'login',
                    data: {
                      cloudID: wx.cloud.CloudID(res2.cloudID)
                    }
                  }).then(suc => {
                    if (!suc.result.errMsg) {
                      let openid = app.globalData.openid = suc.result.openid
                      console.log('get openid suc')
                      wx.request({
                        url: host + '/bindUserWx',
                        method: 'POST',
                        header: {
                          "Content-Type": "application/json",
                          "Authorization": token
                        },
                        data: JSON.stringify({
                          openid: openid,
                          account: account
                        }),
                        success: function(res) {
                          if(res.data.success && res.statusCode==200) {
                            wx.showToast({
                              title: '绑定成功',
                              icon: 'none',
                              duration: 1000
                            })
                          } else {
                            wx.showToast({
                              title: res.data.errMsg,
                              icon: 'none',
                              duration: 1000
                            })
                          }
                        },
                        fail: function(err) {
                          console.log(err)
                          wx.showToast({
                            title: '请求失败！',
                            icon: 'none',
                            duration: 1000
                          })
                        }
                      })
                    } else {
                      wx.showToast({
                        title: '获取用户openid失败！',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }).catch(err2 => {
                    console.error(err2)
                    wx.showToast({
                      title: '获取用户openid失败！',
                      icon: 'none',
                      duration: 1000
                    })
                  })
                },
                fail: err => {
                  wx.showToast({
                    title: '获取用户信息失败！',
                    icon: 'none',
                    duration: 1000
                  })
                }
              })
            }
          }
        })
      }
    },

    chooseRole: function(e){
      wx.navigateTo({
        url: applicationBase+'/pages/chooseRoleNew/chooseRoleNew',
      })
    },

    showLogout: function(e){
      this.setData({
        logoutModal: true
      })
    },

    closeLogout: function(e){
      this.setData({
        logoutModal: false
      })
    },

    logout: function(e){
      app.globalData.companyId = null
      app.globalData.position = null
      wx.redirectTo({
        url: '/pages/main/login/login',
      })
    },

    NavToTalk(e) {
      wx.navigateTo({
        url: applicationBase + '/pages/start/start',
      })
      console.log("navigate")
    },

    NavHome(e) {
      wx.redirectTo({
        url: "../mainq/" + position + "/" + position,
      })
    }

  },

  
})