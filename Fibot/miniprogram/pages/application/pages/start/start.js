var app = getApp();

Page({
  data: {
    imgBase: app.globalData.imgBase,
    remind: '加载中',
    angle: 0
  },
  goToIndex: function () {
    wx.redirectTo({
      url: '/pages/main/talk/talk',
    });
  },
  onLoad: function () {
    var that = this
    that.setData({
      bgRed: 3,
      bgGreen: 169,
      bgBlue: 244
    })
  },
  onShow: function () {
    
  },
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  },
});