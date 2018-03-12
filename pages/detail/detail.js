// pages/detail/detail.js
var bmap = require('../../libs/bmap-wx.min.js');
Page({
    data: {
        yy_msg: {
            name: '',
            address: '',
            updatetime: '',
            yz: '',
            kf: '',
            jcw: '',
            kcw: '',
            tel: '',
            level: '',
            jj: '',
            hj: []
        },
        startlongitude: '',
        endlongitude: '',
        markers: [],
        polyline: []
    },
    //拨号
    boHao: function (e) {
        let newtel = e.target.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: newtel
        })
    },
    onLoad: function (options) {
        let hid = options.hid;
        let This = this;
        let startlongitude, endlongitude;
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        //设置中心定位点
        var BMap = new bmap.BMapWX({
            ak: 'a8T66pkYVINiGXUemGMVxPBITX7fLUct'
        });
        //获取定位，设置用户位置
        BMap.regeocoding({
            success: function (e) {
                console.log(e);
                var wxMarkerData = e.wxMarkerData;
                This.setData({
                    endlongitude: wxMarkerData[0].latitude,
                    startlongitude: wxMarkerData[0].longitude
                });
            },
            fail: function () {
                This.setData({
                    endlongitude: 31.866942,
                    startlongitude: 117.282699
                });
            }
        });
        wx.request({
            url: 'https://api.ahlife.com/applet/?service=hospital.getHospitalByID',
            data: {
                id: hid,
                keyword: '',
                uid: wx.getStorageSync('openID')
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (e) {
                var res = e.data;
                var dataList = res.data.info;
                if (res.ret != 200) {
                    wx.showModal({
                        'title': '提示',
                        'content': res.msg
                    });
                    wx.hideLoading();
                    return false;
                }
                console.log(res);
                //设置数据
                This.setData({
                    yy_msg: dataList,
                    markers: [{
                        iconPath: dataList.iconPath,
                        id: 1,
                        latitude: dataList.latitude,
                        longitude: dataList.longitude,
                        width: 10,
                        height: 20,
                        title: dataList.hospital,
                        address:dataList.address
                    }]
                });
                wx.hideLoading();
            }
        })
    },
    controltap: function (e) {
        console.log(e);
        var This = this;
        let data = This.data.markers[0];
        console.log(data);
        wx.openLocation({
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            scale: 28,
            name: data.title,
            address: data.address
        })


    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})