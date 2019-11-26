// import Toast from 'vant-weapp/toast/toast';

const app = getApp();
const util = require('../../../utils/util.js')
var inputVal = '';
var msgList = [];
var inquiryResults = {};
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var host = app.globalData.requestHost
var token = null

/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';
  var another_that = this;
  msgList = [{
    speaker: 'server',
    contentType: 'text',
    content: '欢迎使用财务机器人Finbot，根据您的习惯我们预测了您最可能问到的一些问题，请问您还有什么指示'
  }]
  wx.request({
    url: host + '/recommend',
    method: 'POST',
    header: {
      "Content-Type": 'application/json',
      'Authorization': token
    },
    success: res => {
      console.log(res.data)
      for(var sentence in res.data.result){
        console.log(sentence)
        console.log(res.data.result[sentence])
        wx.request({
          url: host + '/languageProcess',
          method: 'POST',
          header: {
            "Content-Type": 'application/json',
            'Authorization': token
          },
          data: JSON.stringify({
            language: res.data.result[sentence],
            companyId: app.globalData.companyId,
          }),
          success: res => {
            console.log(res.data)
            if (res.statusCode == 555) {
              app.relogin()
            } else if (res.statusCode == 403) {
              msgList.push({
                speaker: 'server',
                contentType: 'text',
                content: '不好意思，您无权限查询该信息，请联系管理员添加相应权限'
              })
            } else if (res.statusCode != 200 || !res.data.success) {
              msgList.push({
                speaker: 'server',
                contentType: 'text',
                content: res.data.errMsg || '请求失败！'
              })
            } else {
              console.log(res)
              let result = res.data.result
              for (let idx in result) {
                msgList.push({
                  speaker: 'server',
                  contentType: result[idx].type,
                  content: result[idx].summary
                })
                let id = msgList.length - 1
                inquiryResults[`server-${id}`] = result[idx]
              }
            }
            that.setData({
              msgList,
              inquiryResults
            })
            console.log(that.data.msgList)
          },
          fail: err => {
            console.error('request failed', err)
            wx.showToast({
              title: '出现未知错误',
              image: '/imgs/fail.png'
            })
          }
        })
      }
    },
    fail: res => {
      console.log('fail at request recommend')
    },
    complete: res => {
      console.log('complete')
    }
  })
  that.setData({
    msgList,
    inputVal
  })
  console.log(that.data.msgList)
}

function calScrollHeight(that, keyHeight) {
  var query = wx.createSelectorQuery();
  query.select('.scrollMsg').boundingClientRect(function (rect) { }).exec();
}



Page({
  data: {
    imgBase: app.globalData.imgBase,
    inputBottom: 0,
    soundInput: false,
    recordStarted: false
  },
  /**
   * 获取聚焦
   */
  InputFocus(e) {
    keyHeight = e.detail.height
    this.setData({
      scrollHeight: (windowHeight - keyHeight - 150) + 'px'
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: e.detail.height
    })
    calScrollHeight(this, keyHeight);
  },
  InputBlur(e) {
    this.setData({
      scrollHeight: '85vh',
      inputBottom: 0,
      toView: 'msg-' + (msgList.length - 1)
    })
  },
  InputChange(e) {
    inputVal = e.detail.value
  },


  onLoad: function (options) {
    token = app.getToken()
    initData(this);
    // this.setData({
    //   cusHeadIcon: app.globalData.userInfo.avatarUrl,
    // });

  },

  onShow: function () {
    let token = app.getToken()
    const recorder = wx.getRecorderManager()
    var that = this
    recorder.onStart(() => {
      console.log("录音开始")
      that.setData({
        recordStarted: true
      })
    })
    recorder.onStop(res => {
      console.log('录音结束')
      that.setData({
        recordStarted: false
      })
      that.speechRecognition(res)
    })
    recorder.onError(err => {
      console.error(err)
      that.setData({
        recordStarted: false
      })
    })
    recorder.onInterruptionBegin(inter => {
      console.log("recording interrupted")
      that.setData({
        recordStarted: false
      })
      that.recordEnds(null)
    })
  },

  sendMsg: function (e) {
    console.log("send")
    if (e.detail.value == "")
      return
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: e.detail.value
    })
    inputVal = '';
    this.setData({
      msgList,
      inputVal,
      toView: 'msg-' + (msgList.length - 1),
      scrollHeight: '85vh'
    });

    // 处理对话，调用自然语言处理
    // let date = "2019-09-12 00:00:00"
    let token = app.getToken()
    let that = this
    if (token) {
      wx.request({
        url: host + '/languageProcess',
        method: 'POST',
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
        },
        data: JSON.stringify({
          language: e.detail.value,
          companyId: app.globalData.companyId,
          // time: date
        }),
        success: res => {
          if (res.statusCode == 555) {
            app.relogin()
          } else if (res.statusCode == 403) {
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: '不好意思，您无权限查询该信息，请联系管理员添加相应权限'
            })
          } else if (res.statusCode != 200 || !res.data.success) {
            msgList.push({
              speaker: 'server',
              contentType: 'text',
              content: res.data.errMsg || '请求失败！'
            })
          } else {
            console.log(res)
            let result = res.data.result
            for (let idx in result) {
              msgList.push({
                speaker: 'server',
                contentType: result[idx].type,
                content: result[idx].summary
              })
              let id = msgList.length - 1
              inquiryResults[`server-${id}`] = result[idx]
            }
          }
          this.setData({
            msgList,
            inquiryResults
          })
        },
        fail: err => {
          console.error('request failed', err)
          wx.showToast({
            title: '出现未知错误',
            image: '/imgs/fail.png'
          })
        }
      })
    }


  },

  sendByTapping: function (e) {
    let text = inputVal
    e.detail.value = text != undefined ? text : ""
    this.sendMsg(e)
  },

  changeInputType: function (e) {
    let type = this.data.soundInput
    this.setData({
      soundInput: !type
    })
  },

  recordBegins: function (e) {
    console.log('touch start event')
    const recorder = wx.getRecorderManager()
    const options = {
      duration: 30000,
      sampleRate: 8000,
      numberOfChannels: 1,
      encodeBitRate: 16000,
      format: 'mp3',
      frameSize: 50
    }
    wx.getSetting({
      success: suc => {
        if (suc.authSetting['scope.record'] && !this.data.recordStarted) {
          recorder.start(options)
        } else {
          wx.authorize({
            scope: 'scope.record',
            success: () => {
            },
            fail: () => {
              wx.showToast({
                title: '获取用户授权失败, 无法录音',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  recordEnds: function (e) {
    console.log('touch end event', e)
    var { recordStarted } = this.data
    var delta = 0
    if (!recordStarted) {
      delta = 1000
    }
    setTimeout(() => {
      wx.getRecorderManager().stop()
    }, delta)
  },

  speechRecognition: function (res) {
    let that = this
    wx.showToast({
      title: '识别中',
      icon: 'loading',
      duration: 10000
    })
    wx.cloud.uploadFile({
      cloudPath: "tempAudio/tempaudio" + Date.parse(new Date()) + ".mp3",
      filePath: res.tempFilePath
    }).then(res => {
      wx.cloud.callFunction({
        name: 'speechRecognition',
        data: {
          record: res.fileID
        }
      }).then(result => {
        wx.hideToast()
        if (result.result.Response.Error != undefined ||
          result.result.Response.Result == "") {
          wx.showToast({
            title: '识别失败',
            image: '/imgs/fail.png',
            duration: 2000
          })
        } else {
          let msg = result.result.Response.Result
          that.sendMsg({
            detail: {
              value: msg
            }
          })
        }
        wx.cloud.deleteFile({
          fileList: [res.fileID]
        })
      })
    })
  },

  onMsgClicked: function (e) {
    let idx = e.currentTarget.dataset.idx
    console.log(e, idx)
    let inquiryData = inquiryResults[`server-${idx}`]
    if (inquiryData) {
      wx.setStorage({
        key: 'inquiry',
        data: JSON.stringify(inquiryData),
        success: () => {
          console.log('查询结果缓存成功')
          wx.redirectTo({
            url: '../inquiryResult/inquiryResult',
          })
        }
      })
    }
  }
})