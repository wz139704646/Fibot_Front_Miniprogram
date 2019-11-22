// pages/application/subjects/subjects.js
const app = getApp()
const host = app.globalData.requestHost

Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor : '',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    VerticalNavTop: 0,
    subjects: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.options)
  },

  // 请求某一类型的科目数据
  getSubjectsWithType(tabcur) {
    // tabcur, 当前类别的索引
    let token = app.getToken()
    let that = this
    if (token) {
      let subjects = that.data.subjects[tabcur]
      wx.request({
        url: host + '/finance/subject/getSubjects?type='+subjects.type,
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
              title: '无权限查看',
              icon: 'none',
              duration: 1000
            })
          } else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
            })
          } else {
            // 将科目设置到相应类别下
            let subs = res.data.result
            subjects['subs'] = subs
            that.setData({
              [`subjects[${tabcur}]`]: subjects
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
      backgroundColor: app.globalData.backgroundColor,
    })
    // 发送请求获取所有科目类别
    let token = app.getToken()
    let that = this
    if (token) {
      wx.request({
        url: host +'/finance/subject/getTypes',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        success: res => {
          if (res.statusCode == 555) {
            app.relogin()
          } else if(res.statusCode == 403) {
            // 用户权限不足
            console.log('权限不足')
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
            let types = res.data.result
            let subjects = []
            for (let type of types) {
              subjects.push({type})
            }
            that.setData({
              subjects
            }, ()=>{
              let {TabCur} = that.data
              that.getSubjectsWithType(TabCur)
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  tabSelect(e) {
    let that = this
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    }, ()=>{
      that.getSubjectsWithType(e.currentTarget.dataset.id)
    })
  },

  addDetailSubject: function(e) {
    var {TabCur, subjects} = this.data
    wx.navigateTo({
      url: `../addSubject/addSubject?typeName=${subjects[TabCur].type}`,
    })
  },

  onSubjectTapped: function(e) {
    let datafor = this.options.datafor
    if(this.options.datafor) {
      var pages = getCurrentPages()
      var old = pages[pages.length - 2]
      wx.navigateBack({
        success: () => {
          old.setData({
            [datafor]: e.currentTarget.dataset.subject
          })
        }
      })
    }
  }
  
})