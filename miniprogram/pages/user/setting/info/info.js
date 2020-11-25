// pages/user/setting/info/info.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['男', '女'],
    name: '',
    index: '',
    phone: '',
    num: '',
    major: '',
    group: '',
    pos: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let result = await db.collection('users').where({
        _openid:app.globalData.openid
    }).get();
    console.log(app.globalData.openid)
    console.log('result:', result)
    this.setData({
      index: result.data[0].info.sex,
      name: result.data[0].info.name,
      phone: result.data[0].info.phone,
      num: result.data[0].info.num,
      major: result.data[0].info.major,
      group: result.data[0].info.group,
      pos: result.data[0].info.pos
    })
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
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  nameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  numInput(e) {
    this.setData({
      num: e.detail.value
    })
  },
  majorInput(e) {
    this.setData({
      major: e.detail.value
    })
  },

  cancel() {
    wx.navigateBack({
      url: '../setting',
    })
  },

  confirm() {
    console.log(app.globalData.id)
    db.collection('users').doc(app.globalData.id).update({
      data: {
        info: {
          sex: this.data.index,
          name: this.data.name,
          phone: this.data.phone,
          num: this.data.num,
          major: this.data.major,
          group: this.data.group,
          pos: this.data.pos
        }
      },
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: '保存成功'
        });
      },
      fail: function (res) {
        console.log("fail:", res)
      }
    })
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  }
})