const app = getApp()
const host = app.globalData.requestHost
const applicationBase = app.globalData.applicationBase

Page({
  data: {
  },

  // 页面加载函数
  onLoad: function(options) {
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
          var position=res.data.result[0].position

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
            that.getCompanyName()
          }

          //that.getPermission()
          that.navToPosition(position)

        },
        fail: err => {
          console.error('请求失败',err)
          wx.redirectTo({
            url: '../login/login',
          })
        }
      })
    }
  },

  getPermission(e){
    const token = app.getToken()
    wx.request({
      url: host +'/queryPermission',
      method:"POST",
      data:JSON.stringify({
        account:app.globalData.account
      }),
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      success(res){
        console.log("权限")
        console.log(res)
      }
    })
  },

  navToPosition(position){
    var navPath = ""
    if(position == "admin"){
      navPath = applicationBase + "/pages/chooseRoleNew/chooseRoleNew"
    }else{
      navPath = "../mainq/" + position + "/" + position
    }
    wx.redirectTo({
      url: navPath,
    })
  },

  getCompanyName(){
    
    const token = app.getToken()
    wx.request({
      url: host + '/query_CompanyName',
      data:{
        id:app.globalData.companyId
      },
      method:"GET",
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      success(res){
        console.log(res)
        app.globalData.companyName = res.data.result
      }
    })
  }
})