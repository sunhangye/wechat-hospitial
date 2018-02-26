var bmap = require('../../libs/bmap-wx.js')
const HISTORY_KEY = '_history_';
Page({
  onShareAppMessage: function(res) {
    if (res.from == 'button') {
      console.log(res.target);
    }
    return {title: '合肥产科医疗床位查询系统', desc: '自定义转发描述', path: '/page/index'}
  },
  data: {
    listcur: '',
    address: '',
    latitude:'',
    longitude:'',
    ifcan: true,
    lazyLoad: true,
    dataType: 'all',//all,distance,rank,bed,keyword
    pageNum: '1',
    ifLastPage: false,
    showLastHide: 'showLastHide',
    listArr: [],
    ss_hide: 'ss_hide',
    if_ss: false,
    ss_key: '',
    no_data_hide: 'no_data_hide',
    rm: [],
    ls: [],
    navList: [
      {
        type: 'bed',
        name: '床位最多',
        iconClass: 'icon-chuangwei'
      },
      {
        type: 'distance',
        name: '距离最近',
        iconClass: 'icon-weizhi'
      },
      {
        type: 'rank',
        name: '医院等级',
        iconClass: 'icon-yiliao'
      },
    ]

  },
  onLoad: function(options) {
    var that = this;
    var ak = 'tbd4s43UHqof3ZWMWwRnlU2GdECa3aof';
    // 新建百度地图对象
    var BMap = new bmap.BMapWX({ak: ak})

    // 发起regeocoding检索请求
    BMap.regeocoding({
      success: function(data) {
        var wxMarkerData = data.wxMarkerData;
        that.setData({address: wxMarkerData[0].address, latitude: wxMarkerData[0].latitude, longitude: wxMarkerData[0].longitude});
      },
      fail: function(data) {
        that.setData({address: '授权被拒绝...', latitude: 0, longitude: 0});
      }
    });

    that.getArr()
  },
  // 显示搜索页面
  ssShow: function () {
    var that = this;
    if (!that.data.if_ss) {
      that.setData({
        if_ss: true
      })
    } else {
      that.setData({
        if_ss: false
      })
    }
    // 获取热门搜索
    wx.request({
      url: 'https://api.ahlife.com/applet/?service=hospital.hotSearch',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res){
        that.setData({
          rm: res.data.data.info
        })
      },
      fail: function(e) {
      },
      complete: function() {
        // complete
      }
    })
    // 获取历史搜索
    that.setData({
      ls: wx.getStorageSync(HISTORY_KEY) || []
    })
    that.setData({
      ss_hide: ''
    })
  },
  ssHide: function () {
    var that = this;
    if (!that.data.if_ss) {
      that.setData({
        ss_hide: 'ss_hide',
        ss_key: ''
      })
    } else {
      that.setData({
        pageNum: '1',
        ss_key: ''
      })
      //搜索界面取消时获取全部列表
      that.getArr();
    }
  },
  setInput: function (e) {
    var that = this;
    that.setData({
      ss_key: e.detail.value
    })
  },
  sendSs: function (e) {
    var that = this;
    if (e.currentTarget.dataset.key) {
      that.setData({
        ss_key: e.currentTarget.dataset.key
      })
    } else {
      if (that.data.ss_key.replace(/\s/ig, '') == '') {
        wx.showModal({
          title: '提示',
          content: '请输入搜索内容',
          showCancel: false
        })
        return;
      }

    }
    that.setData({
      pageNum: 1,
      dataType: 'keyword',
      ss_hide: 'ss_hide',
    })

    var tempHistory = wx.getStorageSync(HISTORY_KEY) || [];
    tempHistory.push(that.data.ss_key)

    if (tempHistory.length > 10) {
      tempHistory.shift()
    }
    wx.setStorageSync(HISTORY_KEY, tempHistory)
    that.getArr();
  },
  showDeny: function () {
    var that = this;
    if (that.data.address === '授权被拒绝...') {
      wx.showModal({
        title: '解决办法',
        content: '依次点击右上角关于合肥房产-右上角设置-打开地理位置',
        showCancel: false
      })
    }
  },
  loadMoreArr: function (e) {
    var that = this;
    if (that.data.ifLastPage) {
      that.setData({
        showLastHide: ''
      })
      return false;
    }

    that.getArr();
  },
  changeDate: function (e) {
    var that = this;
    that.setData({
      listcur: e.currentTarget.dataset.type,
      dataType: e.currentTarget.dataset.type,
      pageNum: 1,
    })

    that.getArr();
  },
  onReady: function(options) {},
  onShow: function(options) {},
  onHide: function(options) {},
  onUnLoad: function(options) {},
  //**************公共方法***********************//
  getArr: function() {
    let This = this;
    let dataType = This.data.dataType;
    let pageNum = This.data.pageNum;
    let dataKye = This.data.ss_key;
    let lon = This.data.longitude;
    let lat = This.data.latitude;

    wx.showLoading({title: '加载中...', mask: true});

    if (This.data.ifcan) {
      This.setData({ifcan: false});
      // console.log(This.data.ifcan);
    } else {
      // console.log(This.data.ifcan);
      return;
    }
    console.log('排序类别=' + dataType, '页码=' + pageNum, '搜索关键词=' + dataKye);

    let ifLastPage; //当前加载的是否最后一页,true 是最后一页；false 不是最后一页
    let newArr;
    let isAjax = true;

    if (isAjax) {
      isAjax = false;
      wx.request({
        url: 'https://api.ahlife.com/applet/?service=hospital.getHospitalByOrder',
        data: {
          order: dataType,
          pageNum: pageNum,
          value: dataKye,
          lon: lon,
          lat: lat
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(e) {
          var res = e.data;
          var dataList = res.data.info.list;

          // return;
          wx.hideLoading();
          if (res.ret != 200) {
            wx.showModal({'title': '提示', 'content': res.msg});
            This.setData({no_data_hide: ''});
            isAjax = true;
            return false;
          }
          if (!dataList.length) { // !res.listData.length  没有列表的内容时显示提示界面
            This.setData({
              no_data_hide: '',
              listArr: [],
              ifcan: true,
            });
            isAjax = true;
          } else {
            ifLastPage = res.data.info.ifLastPage;
            if (pageNum == 1) {
              newArr = [];
            } else {
              newArr = This.data.listArr;
            }
            for (let i = 0; i < dataList.length; i++) {
              newArr.push(dataList[i]);
            }
            //设置列表数据
            This.setData({
              ifcan: true,
              pageNum: parseInt(pageNum) + 1,
              listArr: newArr,
              ss_hide: 'ss_hide',
              ifLastPage: ifLastPage,
              no_data_hide: 'no_data_hide'
            });
            isAjax = true;
          }
        },
        fail: function(e) {
          isAjax = true;
          wx.hideLoading();
          wx.showModal({
            'title': '提示',
            'content': '网络错误，下拉重试'
          })
        }
      })
    }

  }

})
