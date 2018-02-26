const AV = require('./libs/av-weapp-min.js');
var app = getApp();
App({
  onLaunch: function() {
    // 打开调试
    wx.setEnableDebug({
      enableDebug: true
    })
    AV.init({
      appId: "ddAs7RN0n1VqhXGuNxAsFSr9-gzGzoHsz",
      appKey: "t8X0e880QDqNmPdIRnkinD3p"}
    );
    // 调用api从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs)
    // this.getUserToStorage();
    AV.User.loginWithWeapp().then(user => {
      console.log('登录成功');
      this.globalData.user = user.toJSON();
    }).catch(console.error);

    const user = AV.User.current();
    // 调用小程序 API，得到用户信息
    wx.getUserInfo({
      success: ({userInfo}) => {
        // 更新当前用户的信息
        user.set(userInfo).save().then(user => {
          // 成功，此时可在控制台中看到更新后的用户信息
          this.globalData.user = user.toJSON();
        }).catch(console.error);
      }
    });
  },
  getUserToStorage: function(cb) {
    var _this = this;
    if (wx.getStorageSync('session3rd') == '') {
      // 调用登录接口
      wx.login({
        success: function(res) {
          // success
          console.log(res);
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              code: res.code,
              appId: 'wx26eb7edbcbe7c26d',
              secret: 'c4c08b62effa4c615e2e249d0765ef4d',
              grant_type: 'authorization_code'
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'content-type': 'application/json'
            }, // 设置请求的 header
            success: function(res) {
              // success
              console.log(res);
              var data = res.data;
              if (data.ret == 200 && data.data.code == 0) {
                console.log('登录成功');
                console.log(`openid= ${data.data.openid}`);
                console.log(`session3rd= ${data.data.session3rd}`);
                wx.setStorageSync('session3rd', session3rd + openid)
              } else {
                console.log('登录失败');
                console.log(`code = ${data.data.code}  message = ${data.data.message}`);
              }
            },
            fail: function(res) {
              console.log(res);
            },
            complete: function() {
              // complete
            }
          })
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
    }
  },
  globalData: {

  }
})
