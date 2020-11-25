const app = getApp()
const db = wx.cloud.database()
const _ = db.command;

Page({
  data: {
    imgUrls: [
      "cloud://wxproject-6gpwqom7fdf8cec0.7778-wxproject-6gpwqom7fdf8cec0-1304009470/图片/1.jpg",
      "cloud://wxproject-6gpwqom7fdf8cec0.7778-wxproject-6gpwqom7fdf8cec0-1304009470/图片/2.jpg",
      "cloud://wxproject-6gpwqom7fdf8cec0.7778-wxproject-6gpwqom7fdf8cec0-1304009470/图片/3.jpg"
    ],
    list: ['🎉“微信小程序挑战赛”开始', '🎉YNUER', '🎉敬请期待'],
    indicatorDots: true,
    autoplay: true,
    showModal: false,
    interval: 5000,
    interval2: 11000,
    duration: 1000,
    duration2: 2000,
    windowHeight: wx.getSystemInfoSync().windowHeight,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    btnSize: 0,
    token: wx.getStorageSync('token'),
    status: 2,
    actionSheetHidden: true,
    actionSheetItems: ['签到', '消息', '场地申请'],
    items: [],
    title: '',
    news: ''
  },
  onLoad() {
    var that = this;
    this.setData({
      btnSize: 0.8 * 0.32 * this.data.windowHeight,
    })
    this.init();
  },
  async init() {
    //获取用户openId，通过在数据库中临时创建一条记录来获取

    await db.collection('getId').add({data:{}})
    let getId=await db.collection('getId').get()
    console.log(getId)
    app.globalData.openid=getId.data[0]._openid
    await db.collection('getId').doc(getId.data[0]._id).remove({})
    //1. 从用户集合中取出当前用户信息
    let result = await db.collection('users').where({ _openid: app.globalData.openid }).get();
    console.log(result)
    if (result.data.length == 0) {
      // 当前用户第一次登录，集合中无用户信息，插入当前用户信息记录，并在全局存储docId
      wx.hideLoading();
      wx.redirectTo({
        url: '../login/login',
      });
    } else {
      // 能取到当前用户信息
      app.globalData.id = result.data[0]._id;
    }
    wx.hideLoading();
  },
  onShow() {
    var that = this;

  },
  onHide: function () {
    this.setData({
      status: 2
    })
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  toQiandao() {
    wx.navigateTo({
      url: '../qiandao/qiandao',
    })
  },
  toContest() {
    wx.showToast({
      title: '待开发',
      icon: 'loading'
    })
    return;
    wx.navigateTo({
      url: '../contest/contest',
    })
  },
  toGroup() {
    wx.navigateTo({
      url: '../group/group',
    })
  },
  toAffair() {
    wx.showToast({
      title: '待开发',
      icon: 'loading'
    })
    return;
    wx.navigateTo({
      url: '../affair/affair',
    })
  },
  actionSheetTap: function (e) {//菜单弹出
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetChange: function (e) {//菜单隐藏
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  bind0: function (e) {//发布签到
    this.actionSheetChange()
    wx.navigateTo({
      url: '../qiandao/createqd/createqd',
    })
  },
  bind1: function (e) {//发布消息
    this.actionSheetChange()
    this.setData({
      showModal: true
    })
  },
  bind2: function (e) {
    wx.showToast({
      title: '待开发',
      icon: 'loading'
    })
    return;
  },
  back: function () {
    this.setData({
      showModal: false
    })
  },
  /**
   * 获取input输入值
   */
  wish_put: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  wish_put2: function (e) {
    this.setData({
      news: e.detail.value
    })
  },
  /**
   * 点击确定按钮获取input值并且关闭弹窗
   */
  ok: async function () {
    var that = this
    if (that.data.title == '') {
      wx.showToast({
        title: '标题为空',
        icon: 'none',
      })
      return;
    }
    if (that.data.news == '') {
      wx.showToast({
        title: '内容为空',
        icon: 'none',
      })
      return;
    }
    let user = await db.collection('users').doc(app.globalData.id).get()
    if (user.data.admin == 0) {
      wx.showToast({
        title: '没有发布权限',
        icon: '',
      })
      return;
    }
    var myDate = new Date();
    var curtime = myDate.format('yyyy-MM-dd h:m:s')
    db.collection('news').add({
      data: {
        title: that.data.title,
        news: that.data.news,
        name: user.data.info.name,
        group: user.data.info.group,
        date: curtime.substring(0, 10)
      },
      success() {
        that.setData({
          showModal: false
        }),
          wx.showToast({
            title: '发布成功',
            icon: 'success'
          })
      }
    })
  }
})
//时间数据的格式化
Date.prototype.format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
        date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}