// const app = getApp()
// const host = app.globalData.requestHost
// var inputVal = '';

// Page({
//   data: {
//     StatusBar: app.globalData.StatusBar,
//     CustomBar: app.globalData.CustomBar,
//     hidden: true,
//     goodList: [],
//     pygoodList: [],
//     pyallgoodList: [],
//   },
//   onLoad: function (options) {
//     var that = this
//     that.initGoodList()
//     this.setData({
//       host:host
//     })
//   },
//   initGoodList(){
//     wx.request({
//       url: host + '/queryGoods',
//       data: JSON.stringify({
//         companyId:app.globalData.companyId
//       }),
//       method: "POST",
//       header: {
//         "Content-Type": 'application/json'
//       },
//       success: res => {
//         console.log(res)
//         console.log(res.data.result.goodsList)
//         this.setData({
//           goodList: res.data.result.goodsList
//         })
//       }
//     })

//     var that = this
//     wx.cloud.callFunction({
//       name: 'convert2pinyin',
//       data: {
//         jsonStr: JSON.stringify(this.data.goodList),
//         options: {
//           field: 'name',
//           pinyin: 'pinyin',
//           initial: 'firstletter'
//         }
//       },
//       success: res => {
//         console.log('添加pinyin成功')
//         console.log(res)
//         this.setData({
//           goodList: res.result
//         })
//         that.initpygoodList()
//       },
//       fail: err => {
//         console.error('fail')
//       }
//     })
//   },

//   initpygoodList() {
//     var that = this
//     that.addElement()

//     for (let i = 0; i < this.data.goodList.length; i++) {
//       let j = this.data.goodList[i].firstletter
//       let k = j.charCodeAt(0)
//       this.data.pygoodList[k - 65].cList.push(this.data.goodList[i])
//     }

//     that.delElement()
//     this.setData({
//       pygoodList: this.data.pygoodList,
//       pyallgoodList: this.data.pygoodList,
//       listCur: this.data.pygoodList[0].first
//     });
//   },

//   addElement() {
//     for (let j = 0; j < 26; j++) {
//       this.data.pygoodList.push({
//         first: String.fromCharCode(65 + j),
//         cList: []
//       })
//     }
//   },
//   delElement() {
//     var k = 0
//     for (let j = 0; j < 26 - k; j++) {
//       if (this.data.pygoodList[j].cList.length == 0) {
//         this.data.pygoodList.splice(j, 1)
//         j--
//         k++
//       }
//     }
//   },

//   navigateToGoodInfo(e){
//     console.log(e)
//     console.log("查看详情")
//     wx.navigateTo({
//       url: '/pages/application/goodInfo/goodInfo?name='+e.currentTarget.dataset.name,
//     })
//   },
//   navigateToGoodAnalyse(e){
//     console.log(e)
//     console.log("查看分析")
//   },

//   //获取文字信息
//   getCur(e) {
//     this.setData({
//       hidden: false,
//       listCur: this.data.pygoodList[e.target.id].first,
//     })
//   },

//   setCur(e) {
//     this.setData({
//       hidden: true,
//       listCur: this.data.listCur
//     })

//   },
//   //滑动选择Item
//   tMove(e) {
//     let y = e.touches[0].clientY,
//       offsettop = this.data.boxTop,
//       that = this;
//     //判断选择区域,只有在选择区才会生效
//     if (y > offsettop) {
//       let num = parseInt((y - offsettop) / 20);
//       this.setData({
//         listCur: that.data.pygoodList[num].first
//       })
//     };
//   },

//   //触发全部开始选择
//   tStart() {
//     this.setData({
//       hidden: false
//     })
//   },

//   //触发结束选择
//   tEnd() {
//     this.setData({
//       hidden: true,
//       listCurID: this.data.listCur
//     })
//     console.log(this.data.listCurID)
//   },
//   indexSelect(e) {
//     let that = this;
//     let barHeight = this.data.barHeight;
//     let pygoodList = this.data.pygoodList;
//     let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
//     for (let i = 0; i < list.length; i++) {
//       if (scrollY < i + 1) {
//         that.setData({
//           listCur: pygoodList[i].first,
//           movableY: i * 20
//         })
//         return false
//       }
//     }
//   },
//   inputChange(e) {
//     console.log(e.detail.value)
//     inputVal = e.detail.value
//   },
//   search(e) {
//     var that = this
//     console.log("正在搜索")
//     if (inputVal == "") {
//       this.setData({
//         pygoodList: this.data.pyallgoodList
//       })
//     } else {
//       this.data.pygoodList = []
//       that.addElement()
//       for (let i = 0; i < this.data.goodList.length; i++) {
//         let j = this.data.goodList[i].pinyin
//         let k = j.toUpperCase().charCodeAt(0)
//         let l = this.data.goodList[i].name
//         if (j.indexOf(inputVal) != -1 || l.indexOf(inputVal) != -1) {
//           this.data.pygoodList[k - 65].cList.push(this.data.goodList[i])
//         }
//       }
//       that.delElement()

//       this.setData({
//         pygoodList: this.data.goodList,
//         listCur: this.data.pygoodList[0].first
//       });
//     }
//   },

// })

var app = getApp()
const host = app.globalData.requestHost
var inputVal = '';

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,
    goodList: [

    ],

    pygoodList: [],

    pyallgoodList: [],
  },

  getGoodList() {
    var that = this
    wx.request({
      url: host + '/queryGoods',
      data: JSON.stringify({
        companyId: app.globalData.companyId
      }),
      method: "POST",
      header: {
        "Content-Type": 'application/json'
      },
      success: res => {
        console.log(res)
        console.log(res.data.result)
        this.setData({
          goodList: res.data.result
        })
        that.initGoodList()
      }
    })
  },

  initGoodList() {
    var that = this
    wx.cloud.callFunction({
      name: 'convert2pinyin',
      data: {
        jsonStr: JSON.stringify(this.data.goodList),
        options: {
          field: 'name',
          pinyin: 'pinyin',
          initial: 'firstletter'
        }
      },
      success: res => {
        console.log('添加pinyin成功')
        console.log(res)
        this.setData({
          goodList: res.result
        })
        that.initpygoodList()
      },
      fail: err => {
        console.error('fail')
      }
    })
  },
  addElement() {
    for (let j = 0; j < 26; j++) {
      this.data.pygoodList.push({
        first: String.fromCharCode(65 + j),
        cList: []
      })
    }
  },
  delElement() {
    var k = 0
    for (let j = 0; j < 26 - k; j++) {
      if (this.data.pygoodList[j].cList.length == 0) {
        this.data.pygoodList.splice(j, 1)
        j--
        k++
      }
    }
    console.log(this.data.pygoodList)
  },
  initpygoodList() {
    var that = this
    that.addElement()

    for (let i = 0; i < this.data.goodList.length; i++) {
      let j = this.data.goodList[i].firstletter
      let k = j.charCodeAt(0)
      this.data.pygoodList[k - 65].cList.push(this.data.goodList[i])
    }

    that.delElement()
    this.setData({
      pygoodList: this.data.pygoodList,
      pyallgoodList: this.data.pygoodList,
      listCur: this.data.pygoodList[0].first
    });
  },
  onLoad(options) {
    if (options.back) {
      this.setData({
        back: options.back
      }, res => {
        this.getGoodList()
      })
    } else {
      this.getGoodList()
    }
  },
  onReady() {
    let that = this;
    wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function (res) {
      that.setData({
        boxTop: res.top
      })
    }).exec();
    wx.createSelectorQuery().select('.indexes').boundingClientRect(function (res) {
      that.setData({
        barTop: res.top
      })
    }).exec()
  },
  //获取文字信息
  getCur(e) {
    this.setData({
      hidden: false,
      listCur: this.data.pygoodList[e.target.id].first,
    })
  },

  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })

  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.pygoodList[num].first
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
    console.log(this.data.listCurID)
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let pygoodList = this.data.pygoodList;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: pygoodList[i].first,
          movableY: i * 20
        })
        return false
      }
    }
  },
  inputChange(e) {
    console.log(e.detail.value)
    inputVal = e.detail.value
  },
  search(e) {
    var that = this
    console.log("正在搜索")
    if (inputVal == "") {
      this.setData({
        pygoodList: this.data.pyallgoodList
      })
    } else {
      this.data.pygoodList = []
      that.addElement()
      for (let i = 0; i < this.data.goodList.length; i++) {
        let j = this.data.goodList[i].pinyin
        let k = j.toUpperCase().charCodeAt(0)
        let l = this.data.goodList[i].name
        if (j.indexOf(inputVal) != -1 || l.indexOf(inputVal) != -1) {
          this.data.pygoodList[k - 65].cList.push(this.data.goodList[i])
        }
      }
      that.delElement()
      console.log(this.data.pygoodList)

      this.setData({
        pygoodList: this.data.pygoodList,
        listCur: this.data.pygoodList[0].first
      });
    }

  },

  choose: function (e) {
    let back = this.data.back
    if (back) {
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      var cus = e.currentTarget.dataset.cus
      //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        customer: cus
      });
      wx.navigateBack({
        delta: 1
      })
    }
  }
});