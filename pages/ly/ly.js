// pages/ly/ly.js
var app = getApp();
Page({
  data: {
    isshow: '',
    tel: '',
    message: ''
  },
  //拨号
  boHao: function(e) {
    let newtel = e.target.dataset.tel;
    wx.makePhoneCall({phoneNumber: newtel})
  },
  //显示二维码
  showHideEwm: function() {
    let This = this;
    This.data.isshow == 'show'
      ? This.setData({isshow: ''})
      : This.setData({isshow: 'show'});
  },
  //输入框聚焦时隐藏二维码
  hideEwm: function() {
    let This = this;
    This.setData({isshow: ''})
  },
  //手机号
  setInput: function(e) {
    let This = this;
    This.setData({tel: e.detail.value})
  },
  //反馈内容
  setTextarea: function(e) {
    let This = this;
    This.setData({message: e.detail.value})
  },
  //提交反馈内容
  sendMsg: function() {

    let reg = /^1\d{10}$/;
    let This = this;
    let _content = This.data.message;
    let _tel = This.data.tel.replace(/\s/ig, "");
    console.log(app.globalData);
    if (!_tel || _tel.length < 11 || !reg.test(_tel)) {
      wx.showModal({
        title: '提示',
        content: '请输入您正确的联系方式',
        showCancel: false})
      return;
    }
    if (!_content) {
      wx.showModal({
        title: '提示',
      content: '请输入您的反馈内容',
      showCancel: false})
      return;
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    var openID = app.globalData.user.authData.lc_weapp.openID;
    wx.request({
      url: 'https://api.ahlife.com/applet/?service=hospital.feedback',
      data: {
        'type': '',
        'uid': openID,
        'content': _content,
        'mobile': _tel
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        if (res.data.ret != 200) {
          wx.showModal({'title': '提示', 'content': res.data.msg});
          wx.hideLoading();
          return false;
        }
        wx.hideLoading();
        wx.showToast({title: '成功', icon: 'success', duration: 1000})
      }
    })
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})
