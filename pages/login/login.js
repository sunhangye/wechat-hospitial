// pages/login/login.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    pwd: '',
    pwdInputDisabled: true,
    loginBtnDisabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad');

    this.animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
    })

    this.userInputAnimation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
    })

    this.loginAnimation = wx.createAnimation({
      duration: 700,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
    })
  },

  // 用户输入事件
  userInputEvent: function (e) {
    that = this;
    that.setData({
      userName: e.detail.value
    })

    var opacity = 0;
    var pwdInputDisabled = that.data.pwdInputDisabled;

    if (that.data.userName.length >= 8) {
      opacity = 1;
      pwdInputDisabled = false;
    } else {
      opacity = 0;
      pwdInputDisabled = true;
      that.setData({
        pwd: ''
      })
    }

    that.animation.opacity(opacity).step();
    that.setData({
      animation: that.animation.export(),
      pwdInputDisabled: pwdInputDisabled
    })
  },
  userInputBindfocus: function (e) {
    that = this;
    if (that.data.userName.length >= 8) {
      this.userInputAnimation.translateY(0).scale(1).opacity(1).step();
      that.setData({
        userInputAnimation: that.userInputAnimation.export()
      })

      that.animation.translateY(0).step();
      that.setData({
        animation: that.animation.export()
      })

      this.loginAnimation.height(0.5).step()
    this.setData({
      loginAnimation: this.loginAnimation.export()
    })
    }
  },
  // 密码输入事件
  pwdInputEvent: function (e) {
    that = this;
    that.setData({
      pwd: e.detail.value
    })

    that.autoLoginBtnHeightAdjust();
  },
  // 密码 获取焦点
  pwdInputBindfocus: function (e) {
    that = this;
    this.userInputAnimation.translateY(-40).scale(0.75).opacity(0.75).step();
    this.animation.translateY(-54).step();
    that.setData({
      userInputAnimation: this.userInputAnimation.export(),
      animation: this.animation.export(),
    })
    that.autoLoginBtnHeightAdjust();
  },
  //自动调整高度
  autoLoginBtnHeightAdjust: function () {
    that = this;
    if (that.data.pwd.length >= 8) {
      that.loginAnimation.height(44).step()
      that.setData({
        loginAnimation: that.loginAnimation.export()
      })
    } else {
      that.loginAnimation.height(0.5).step()
      that.setData({
        loginAnimation: that.loginAnimation.export()
      })
    }
  },
  loginBtnOnClick: function () {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
