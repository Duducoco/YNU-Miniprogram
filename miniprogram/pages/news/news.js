const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    tabOne: true,
    borderOne: 'orange',
    colorOne: 'black',
    windowHeight: wx.getSystemInfoSync().windowHeight,
    width: '100',
  },
  
  onLoad:async function (options) {
    let news=await db.collection('news').get();
    let user=await db.collection('users').doc(app.globalData.id).get();
    var ans=[];
    console.log(news);
    for(var i=0;i<news.data.length;i++){
      if(news.data[i].group==user.data.info.group)
        ans.unshift(news.data[i]);
    }
    this.setData({
        list:ans
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
    this.onLoad()
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
    })
  },
  toCreategroup() {
    wx.navigateTo({
      url: './creategroup/creategroup',
    })
  },

  detail(e) {
      var that=this
    console.log(e)
    this.setData({
        title:that.data.list[e.currentTarget.id].title,
        news:that.data.list[e.currentTarget.id].news,
        showModal: true
      })
  },
  ok: function () {
    this.setData({
      showModal: false
    })
  },
})