const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
var QRCode = require("./weapp-qrcode.js");
// pages/qiandao/qrshow/qrshow.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.generate(app.globalData.qrid)
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

    },
    generate: function (e) {

        // 生成二维码 这里的QRCode方法下面有讲解
        var qrcode = new QRCode('canvas', {
            text: e,
            width: 200,
            height: 200,
            padding: 12, // 生成二维码四周自动留边宽度，不传入默认为0
            correctLevel: QRCode.CorrectLevel.H, // 二维码可辨识度
            callback: (res) => {
                console.log(res)
                // 接下来就可以直接调用微信小程序的api保存到本地 将图片地址保存到 postUrl
                this.setData({
                    postUrl:res.path
                })
            }
        })

    },
   
    // 保存二维码功能
    savePic: function () {
        wx.saveImageToPhotosAlbum({
            filePath: this.data.postUrl,
            success: function (data) {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 1500
                })
            }
        })
    }
})