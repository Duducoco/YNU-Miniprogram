var app = getApp()
const db = wx.cloud.database()
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    list2: [],
    tabOne: true,
    tabTwo: false,
    borderOne: 'orange',
    colorOne: 'black',
    borderTwo: '#999999',
    colorTwo: '#999999',
    windowHeight: wx.getSystemInfoSync().windowHeight,
    width: '100',
    keyword: '',
    token: wx.getStorageSync('token')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var that = this;
    let user = await db.collection('users').doc(app.globalData.id).get();
    console.log(user)
    var ans = [];
    for (var id in user.data.qiandao) {
      var tmp = { id: id, name: user.data.qiandao[id].name, nums: user.data.qiandao[id].num };
      ans.push(tmp);
    }
    that.setData({
      list: ans
    })
    let qd = await db.collection('qiandao').where({
      info: {
        owner: app.globalData.id
      }
    }).get()
    console.log(qd)
    that.setData({
      list2: qd.data
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
    var that = this;

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
  tabOne() {
    this.setData({
      tabOne: true,
      tabTwo: false,
      borderOne: 'orange',
      colorOne: 'black',
      borderTwo: '#999999',
      colorTwo: '#999999'
      // backgroundColorOne: 'black',
      // colorOne: '#EFEDED',
      // backgroundColorTwo: '#EFEDED',
      // colorTwo: 'black',
    })
  },
  async tabTwo() {
    var that = this;
    that.setData({
      tabTwo: true,
      tabOne: false,
      borderOne: '#999999',
      colorOne: '#999999',
      borderTwo: 'orange',
      colorTwo: 'black'
    })
  },

  toDetail(e) {
    console.log(e.currentTarget.id)
    var data=this.data.list2
    console.log(data)
    wx.navigateTo({
      url: './detail/detail?qrid='+data[e.currentTarget.id]._id
    })
  },

})