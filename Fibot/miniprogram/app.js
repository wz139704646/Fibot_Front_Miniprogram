//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    
  },
  globalData: {
    // requestHost: 'http://localhost:5000',
    //requestHost: 'http://47.100.244.29',
    // requestHost: 'https://47.100.244.29',
    requestHost:'https://www.fibot.cn', 
    imgBase: 'cloud://zqr-testdemo-974f2b.7a71-zqr-testdemo-974f2b',
    applicationBase: "/pages/application",
    statisticsBase: "/pages/statistics",
    mainBase:"/pages/main",
    companyId:"5",
    backgroundColor:"bg-gradual-blue",

    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
    ],
  },

  relogin: function() {
    wx.showToast({
      title: '请先登录',
      icon: 'none',
      mask: true,
      duration: 2000,
      success: () => {
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/main/login/login',
          })
        }, 1000)
      }
    })
  },

  getToken: function() {
    try{
      let token = wx.getStorageSync('jwt_token')
      if(token) {
        return "JWT " + token
      } else {
        this.relogin()
        return ""
      }
    } catch(err) {
      console.log('获取token出错', err)
      this.relogin()
      return ""
    }
  },
})
