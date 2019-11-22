// pages/application/trialBalance/trialBalance.js
const app = getApp()
const host = app.globalData.requestHost

Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor : '',
    CustomBar: app.globalData.CustomBar,
    timeIndex: [0, 0],
    timeArray: [[], []],
    trials: []
  },

  // 查询科目余额已记录的期数
  getTimes: function(callback) {
    let token = app.getToken()
    let that = this
    if(token) {
      wx.request({
        url: host +'/finance/subject/getTimes',
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
            let {low, up} = res.data.result
            let lowy = parseInt(low.substring(0, 4))
            let lowm = parseInt(low.substring(4))
            let upy = parseInt(up.substring(0, 4))
            let upm = parseInt(up.substring(4))
            let years = []
            let times = []
            let genTime = (start, end) => {
              let genT = []
              for (let i = end; i >= start; i--) {
                if (i > 9) {
                  genT.push(`${i}`)
                }
                else {
                  genT.push(`0${i}`)
                }
              }
              return genT
            }
            for(let y=upy; y>=lowy; y--){
              let s = 1
              let e = 12
              if(y==lowy){
                s = lowm
              }
              if(y==upy){
                e = upm
              }
              years.push(y)
              times.push(genTime(s, e))
            }
            that.setData({
              years, times
            }, callback)
          }
        }
      })
    }
  },

  getBalanceWithTimeType: function(time, typeIdx){
    console.log(time)
    let token = app.getToken()
    let that = this
    if(token) {
      let type = this.data.trials[typeIdx].type
      let subsPath = `trials[${typeIdx}].subs`
      wx.request({
        url: host +'/finance/subject/getBalance',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: {
          time: time,
          type: type
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
              title: `${type}` + (res.data.errMsg || '请求失败'),
              icon: 'none', duration: 1000
            })
          } else {
            let subs = res.data.result
            that.setData({
              [subsPath]: subs
            }, ()=>{
              that.setData({
                filterTrials: that.data.trials
              })
            })
          }
        }
      })
    }
  },

  getInitBalance: function(time){
    let token = app.getToken()
    let that = this
    if (token) {
      wx.showLoading({
        title: ''
      })
      wx.request({
        url: host + '/finance/subject/getTypes',
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
            let trials = []
            let types = res.data.result
            for (let tp of types) {
              trials.push({
                type: tp,
                activeNames: [],
                subs: []
              })
            }
            that.setData({
              trials,
              filterTrials: trials
            }, () => {
              for(let t in trials){
                that.getBalanceWithTimeType(time, t)
              }
            })
          }
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = this.data
    this.setData({
      filterTrials: data.trials,
      searchText: ""
    })
    this.getTimes(()=>{
      let {years, times} = this.data
      let timeArray = [[], []]
      timeArray[0] = years
      timeArray[1] = times[0]
      this.setData({
        timeIndex: [0, 0],
        timeArray
      }, () => {
        this.getInitBalance(years[0]+times[0][0])
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      backgroundColor: app.globalData.backgroundColor,
    })


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

  // 折叠板展开状态的改变
  onActiveChange: function(e) {
    console.log(e)
    let idx = e.currentTarget.dataset.idx
    let trial = "filterTrials["+idx+"].activeNames"
    this.setData({
      [trial]: e.detail
    })
  },

  // 时间选择item改变
  MultiChange(e) {
    console.log('index', e)
    let idx = e.detail.value
    let {trials} = this.data
    // 清空之前的科目余额列表
    for(let t in trials){
      trials[t].subs = []
    }
    this.setData({
      timeIndex: idx,
      searchText: '',
      trials
    }, () => {
      // 根据期数的变化重新 getBalance
      let timeArr = this.data.timeArray
      let time = timeArr[0][idx[0]]+timeArr[1][idx[1]]
      for (let t in trials) {
        this.getBalanceWithTimeType(time, t)
      }
    })
  },

  // 点击时间选择中对列的改变
  MultiColumnChange(e) {
    let data = {
      timeArray: this.data.timeArray,
      timeIndex: this.data.timeIndex
    }
    let {times} = this.data.times
    data.timeIndex[e.detail.column] = e.detail.value
    // 改变的列为年份
    if (e.detail.column == 0) {
      data.timeArray[1] = times[e.detail.value]
      data.timeIndex[1] = 0
    }
    this.setData(data)
  },

  searchInput: function(e) {
    this.setData({
      searchText: e.detail.value
    })
  },

  search: function(e) {
    let searchText = this.data.searchText
    // 搜索词为空，展示所有
    if(!searchText) {
      let trials = this.data.trials
      this.setData({
        filterTrials: trials
      })
      return
    }
    
    let filter = []
    let trials = this.data.trials
    for(var t of trials) {
      // 搜索类，直接所有的包含进去
      if((`${t.type}`).includes(searchText)){
        filter.push(JSON.parse(JSON.stringify(t)))
        let len = filter.length
        filter[len-1].activeNames = []
        for(var item of t.subs) {
          filter[len-1].activeNames.push(item.subject_code)
        }
      } else  {
        // 否则检查其子科目
        for(var item of t.subs) {
          if((`${item.subject_code}`).includes(searchText) ||
          item.name.includes(searchText)) {
            var len = filter.length
            if(len==0 || filter[len-1].type!=t.type) {
              filter.push(JSON.parse(JSON.stringify(t)))
              filter[len].subs = [item]
              filter[len].activeNames = [item.subject_code]
            } else {
              filter[len-1].subs.push(item)
              filter[len-1].activeNames.push(item.subject_code)
            }
          }
        }
      }
    }
    this.setData({
      filterTrials: filter
    })
  }
})