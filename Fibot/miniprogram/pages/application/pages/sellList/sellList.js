const app = getApp()
const util = require('../../../../utils/util.js')
const host = app.globalData.requestHost
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor : '',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    fun: null,
    sellList: [],
    page: 0,
    allLoaded: false,
    showSearchContents: false,
    searchContents: [ 
      "日期",
      "客户姓名",
      "销售单号"
    ],
    searchContentIdx: 0,
    lastSearch: {
      inputValue: "",
      searchContentIdx: 0
    }
  },

  /**
   * 延迟隐藏loading工具
   * delay: 延迟的毫秒数
   */
  delayHideLoading: function(delay) {
    setTimeout(() => {
      wx.hideLoading()
    }, delay)
  },

  /**
   * 加载新页面
   * param: 请求参数，在进行搜索或进行全部查询的时候有不同，需调用者传入
   */
  loadNewPage: function(param) {
    if (!param) {
      return
    }
    let token = app.getToken()
    if (token) {
      let that = this
      let {page} = that.data
      page = page + 1
      param['page'] = page
      console.log('发起请求', param)
      wx.showLoading({
        title: '正在加载新数据',
        mask: true
      })
      wx.request({
        url: host + '/querySell',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        method: 'POST',
        data: JSON.stringify(param),
        success: res => {
          console.log(res)
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
            let newlist = res.data.result
            if (newlist.length == 0) {
              console.log('返回空列表')
              wx.showToast({
                title: '没有更多数据了',
                icon: 'none',
                duration: 2000
              })
              that.setData({
                allLoaded: true
              })
              return
            }
            // 存储索引列表和所有列表
            var datelist = that.data.sellList || []
            var index1
            for (let i in newlist) {
              //newlist[i]['index'] = i
              newlist[i]['date'] = newlist[i]['date'].toString().substring(0, 10)
              newlist[i]['sum'] = that.calcTotal(newlist[i].goodsList)
              index1 = that.ifDateInList(newlist[i].date, datelist)
              //console.log(index1)
              if (index1) {
                //console.log("add")
                datelist[index1 - 1].list.push(newlist[i])
              } else {
                var list = []
                list.push(newlist[i])
                datelist.push({
                  date: newlist[i].date,
                  list: list
                })
              }
            }
            // 后端已经做了排序
            //datelist.sort(that.sortNumber)
            console.log(datelist)
            that.setData({
              sellList: datelist,
              page,
              allLoaded: false
            }, () => {
              that.delayHideLoading(500)
            })
          }
        },
        fail: err1 => {
          wx.hideLoading()
          console.error(err1)
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },

  /**
   * 进行搜索并加载新页
   */
  search: function (loadMore=false) {
    let token = app.getToken()
    if (token) {
      var that = this
      let { lastSearch, page, sellList } = that.data
      let { inputValue, searchContentIdx } = lastSearch
      if (!loadMore) {
        // 如果是进行重新搜索，则重新获取搜索文本和搜索内容索引
        inputValue = that.data.inputValue
        searchContentIdx = that.data.searchContentIdx
      }
      let param = { companyId: app.globalData.companyId }
      // 比较搜索内容是否变更过
      if (!loadMore) {
        // 搜索内容变动，将页数重置，列表清空
        console.log('清空列表')
        page = 0
        sellList = []
      }
      that.setData({
        page, sellList
      }, () => {
        // 设置完页面和销售列表后，进行新数据的加载
        if (!inputValue) {
          // 输入框没有信息
          that.loadNewPage(param)
          return
        }
        // 根据搜索内容，在请求参数中添加对应
        switch (searchContentIdx) {
        case 0:
          // 进行日期搜索
          param['date'] = inputValue
          break
        case 1:
          // 进行客户姓名搜索
          param['customerName'] = inputValue
          break
        case 2:
          param['id'] = inputValue
          break
        }
        // 进行新数据加载
        that.loadNewPage(param)
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
    this.setData({
      fun: options.fun
    })
    // 检查之前的页面是否有排序的需要
    var pages = getCurrentPages()
    let prev = pages[pages.length - 2]
    let searchValue = prev ? prev.data.searchValue : this.data.inputValue
    if (searchValue) {
      // 将之前页面需要排序的值设置为搜索文本
      this.setData({
        inputValue: searchValue
      }, () => {
        // 等待搜索文本设置完毕后进行搜索
        this.search()
      })
    } else {
      // 进行搜索从而加载新页面
      this.search()
    }
  },

  /**
   * 监听触底刷新
   */
  onReachBottom: function() {
    console.log('触底加载')
    wx.pageScrollTo({
      scrollTop: 0,
    })
    this.search(true)
  },

  //按日期排序
  sortNumber(a, b) {
    return a.date - b.date
  },
  //计算总价
  calcTotal(list) {
    var total = 0
    for (var i in list) {
      total = total + list[i].sumprice
    }
    return util.twoDecimal(total)
  },
  //判断日期是否在列表内
  ifDateInList(date, list) {
    for (var i in list) {
      var num = parseInt(i) + 1
      if (date == list[i].date) return num
    }
    return false
  },
  //判断id是否在列表内
  ifIdInList(id, list) {
    for (var i in list) {
      for (var j in list[i].list) {
        if (id == list[i].id) {
          return true
        }
      }
    }
    return false
  },
  // 查看销售详情
  toDetail(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: '../recordInfo/recordInfo?back=sell' + '&id=' + id + '&fun=' + this.data.fun + '&status=' + status
    })
  },

  // 搜索内容文本被点击
  onSearchContentSelect: function(e) {
    console.log('选择搜索内容')
    this.setData({
      showSearchContents: true
    })
  },

  // 关闭搜索内容选择模态框
  onModalClose: function (e) {
    this.setData({
      showSearchContents: false
    })
  },

  // 确定搜索内容
  onSearchContentConfirm: function(e) {
    console.log('搜索内容更改为'+this.data.searchContents[e.detail.index])
    this.setData({
      showSearchContents: false,
      searchContentIdx: e.detail.index
    })
  },

  // 搜索框文本输入
  onSearchTextInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  }, 

  // 点击搜索按钮
  onSearchButtonTapped: function(e) {
    console.log('开始搜索')
    let {lastSearch, inputValue, searchContentIdx} = this.data
    // 检查点击时是否有必要进行新的搜索
    if (lastSearch.inputValue != inputValue || (inputValue && lastSearch.searchContentIdx != searchContentIdx)) {
      this.search()
      // 将当前搜索的内容记为上次搜索的内容
      this.setData({
        lastSearch: {
          inputValue: this.data.inputValue,
          searchContentIdx: this.data.searchContentIdx
        }
      })
    }
  },
})