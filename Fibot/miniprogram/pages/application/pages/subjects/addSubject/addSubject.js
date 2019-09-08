// pages/application/subjects/addSubject/addSubject.js
const app = getApp()
const host = app.globalData.requestHost
const subjectUtil = require('../util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPicker: false,
  },

  getAllTypes: function(callback) {
    let that = this
    let token = app.getToken()
    if(token) {
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
          } else if (res.statusCode == 403) {
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
            that.setData({
              types
            }, callback)
          }
        }
      })
    }
  },

  getNewCode: function(code){
    let token = app.getToken()
    let that = this
    if (token) {
      wx.request({
        url: host +'/finance/subject/getNewCode?subject_code='+code,
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
              title: '无权限获取新科目代码',
              icon: 'none',
              duration: 1000
            })
          } else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
            })
          } else {
            let newCode = res.data.result
            that.setData({newCode})
          }        
        }
      })
    }
  },

  getSubjectsWithType: function(tp) {
    let token = app.getToken()
    let that = this
    if (token) {
      wx.request({
        url: host + '/finance/subject/getSubjects?type=' + tp,
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
            // 将科目设置到picker数据源中
            let subs = res.data.result
            for(let i in subs){
              subs[i]['text'] = `${subs[i].subject_code} ${subs[i].name}`
            }
            that.setData({
              subs,
              curSub: subs[0],
              newName: subs[0].name+"-"
            }, ()=>{
              that.getNewCode(subs[0].subject_code)
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let typeName = options.typeName
    let that = this
    let token = app.getToken()
    if (token) {
      // 获取所有类别和当前类别下的所有科目信息
      that.getAllTypes(() => {
        let {types} = that.data
        let typeName = types[0]
        that.setData({
          types, typeName
        }, ()=>{
          that.getSubjectsWithType(typeName)
        })
      })
    }
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

  // 点击类别选择cell
  onChooseType: function(e) {
    this.setData({
      showPicker: true,
      modalName: 'type'
    })
  },

  // 点击上级科目选择cell
  onChooseUpper: function(e) {
    this.setData({
      showPicker: true,
      modalName: 'upper'
    })
  },

  onCodeInput: function(e) {
    this.setData({
      newCode: e.detail
    })
  },

  onNameInput: function(e) {
    this.setData({
      newName: e.detail
    })
  },

  onSubmit: function(e) {
    let that = this
    let token = app.getToken()
    console.log('submit')
    if (token) {
      var { typeName, curSub, newCode, newName } = this.data
      wx.showModal({
        title: '确认添加',
        content: `明细科目 ${newCode} ${newName} 将被添加到${typeName}${curSub.text}下，是否确认？`,
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '请求提交中',
              mask: true
            })
            // 添加新的明细科目
            wx.request({
              url: host + '/finance/subject/addSubject',
              method: 'POST',
              header: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              data: JSON.stringify({
                subject_code: newCode,
                name: newName,
                superior_subject_code: curSub.subject_code
              }),
              success: res => {
                if (res.statusCode == 555) {
                  app.relogin()
                } else if (res.statusCode == 403) {
                  wx.showToast({
                    title: '无权限添加明细科目',
                    icon: 'none',
                    duration: 1000
                  })
                } else if (res.statusCode != 200 || !res.data.success) {
                  wx.showToast({
                    title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
                  })
                } else {
                  // 添加完毕，返回，将数据添加到上级页面
                  var pages = getCurrentPages()
                  var old = pages[pages.length - 2]
                  var { typeName, newCode, newName } = that.data
                  wx.navigateBack({
                    success: () => {}
                  })
                }
              }
            })
          }
        },
        fail: function (err) {
          console.error('调起模态确认框失败', err)
        }
      })
    }
  },

  onCancel: function(e) {
    wx.navigateBack({})
  },

  onModalClose: function(e) {
    this.setData({
      showPicker: false
    })
  },

  setType: function (typeId, typeName) {
    // 通过typeId发起请求获取所有科目并保存在data.subs，并设置默认科目代码和名称
    this.setData({
      typeName
    }, () => {
      this.getSubjectsWithType(typeName)
    })
  },

  setUpper: function (idx, curSub) {
    let { subs } = this.data
    this.setData({
      newName: subs[idx].name+"-",
      curSub: curSub
    }, ()=>{
      this.getNewCode(subs[idx].subject_code)
    })
  },

  onPickerConfirm: function(e) {
    console.log(e)
    var { modalName } = this.data
    const { value, index } = e.detail
    // picker类型为type选择时
    if(modalName == 'type') {
      this.setType(index, value)
    } else {
      this.setUpper(index, value)
    }
    this.onModalClose()
  },
})