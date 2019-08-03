// pages/application/trialBalance/trialBalance.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    timeIndex: [0, 0],
    timeArray: [
      [2019, 2018, 2017],
      [1, 2, 3, 4, 5, 6]
    ],
    trials: [
      {
        code: 1001,
        activeNames: [],
        subs: [
          {
            code: 1001,
            name: '库存现金',
            debit: 12000,
            credit: 3200,
            init: 64000,
            term: 51680
          }
        ]
      },
      {
        code: 1002,
        activeNames: [],
        subs: [
          {
            code: 1002,
            name: '银行存款',
            debit: 12000,
            credit: 3200,
            init: -64000,
            term: -51680
          },
          {
            code: 1002010,
            name: '银行存款-花旗银行',
            debit: 12000,
            credit: 3200,
            init: -64000,
            term: -51680
          }
        ]
      },
      {
        code: 1002,
        activeNames: [],
        subs: [
          {
            code: 1002,
            name: '银行存款',
            debit: 12000,
            credit: 3200,
            init: -64000,
            term: -51680
          },
          {
            code: 1002010,
            name: '银行存款-花旗银行',
            debit: 12000,
            credit: 3200,
            init: -64000,
            term: -51680
          }
        ]
      },
      {
        code: 1002,
        activeNames: [],
        subs: [
          {
            code: 1002,
            name: '银行存款',
            debit: 12000,
            credit: 3200,
            init: -64000,
            term: -51680
          },
          {
            code: 1002010,
            name: '银行存款-花旗银行',
            debit: 12000,
            credit: 3200,
            init: -64000,
            term: -51680
          }
        ]
      },
      {
        code: 1002,
        activeNames: [],
        subs: [
          {
            code: 1002,
            name: '银行存款',
            debit: 12000,
            credit: 3200,
            init: -64000,
            term: -51680
          },
          {
            code: 1002010,
            name: '银行存款-花旗银行',
            debit: 12000,
            credit: 3200,
            init: -64000,
            term: -51680
          }
        ]
      }
    ]
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.setData({
      timeIndex: e.detail.value
    })
  },

  // 点击时间选择中对列的改变
  MultiColumnChange(e) {
    let data = {
      timeArray: this.data.timeArray,
      timeIndex: this.data.timeIndex
    }
    data.timeIndex[e.detail.column] = e.detail.value
    // 改变的列为年份
    if (e.detail.column == 0) {
      // 年份不为今年，则满12期
      if (data.timeArray[0][data.timeIndex[0]] != (new Date()).getFullYear()) {
        data.timeArray[1] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      } else {
        // 如果年份为今年，则可能不满12期（这里可能根据后台来改变）
        data.timeArray[1] = [1, 2, 3, 4, 5, 6]
      }
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
      // 包含大类的科目，直接所有的包含进去
      if((`${t.code}`).includes(searchText)){
        filter.push(JSON.parse(JSON.stringify(t)))
        let len = filter.length
        filter[len-1].activeNames = []
        for(var item of t.subs) {
          filter[len-1].activeNames.push(item.code)
        }
      } else  {
        // 否则检查其子科目
        for(var item of t.subs) {
          if((`${item.code}`).includes(searchText) ||
          item.name.includes(searchText)) {
            var len = filter.length
            if(len==0 || filter[len-1].code!=t.code) {
              filter.push(JSON.parse(JSON.stringify(t)))
              filter[len].subs = [item]
              filter[len].activeNames = [item.code]
            } else {
              filter[len-1].subs.push(item)
              filter[len-1].activeNames.push(item.code)
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