// pages/application/subjects/subjects.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    VerticalNavTop: 0,
    subjects: [
      {
        title: '资产类',
        id: 0,
        subs: [
          {
            code: 1001,
            name: '库存现金'
          },
          {
            code: 1002,
            name: '银行存款'
          }
        ]
      },
      {
        title: '负债类',
        id: 1,
        subs: [
          {
            code: 2001,
            name: '短期借款'
          },
          {
            code: 2101,
            name: '交易性金融负债'
          }
        ]
      },
      {
        title: '权益类',
        id: 2,
        subs: [
          {
            code: 4001,
            name: '实收资本'
          },
          {
            code: 4002,
            name: '资本公积'
          }
        ]
      },
      {
        title: '成本类',
        id: 3,
        subs: [
          {
            code: 5001,
            name: '生产成本'
          },
          {
            code: 5101,
            name: '制造费用'
          }
        ]
      },
      {
        title: '损益类',
        id: 4,
        subs: [
          {
            code: 6001,
            name: '主营业务收入'
          },
          {
            code: 6051,
            name: '其他业务收入'
          }
        ]
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },

  addDetailSubject: function(e) {
    var {TabCur, subjects} = this.data
    wx.navigateTo({
      url: `../addSubject/addSubject?type=${TabCur}&typeName=${subjects[TabCur].title}`,
    })
  }
  
})