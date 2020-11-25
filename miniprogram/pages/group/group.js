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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    var that = this;
    var group=await db.collection('group').get()
    var ans=[]
    var user=await db.collection('users').doc(app.globalData.id).get()
    var teamName='';
    var total=0;
    var id=''
    for(var i=0;i<group.data.length;i++){
      var teamStatus='';
      var bgcolor='black';
      if(group.data[i].name==user.data.info.group){
        teamStatus='已加入'
        bgcolor = 'green'
      }else if(user.data.apply.group.includes(group.data[i]._id)){
        teamStatus='已申请'
        bgcolor = 'lightblue'
      }
      teamName=group.data[i].name;
      total=group.data[i].total;
      id=group.data[i]._id;
      ans.push({
        teamStatus:teamStatus,
        bgcolor:bgcolor,
        teamName:teamName,
        total:total,
        id:id
      })
    }
    that.setData({
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

  groupDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: './groupdetail/groupdetail?id='+e.currentTarget.id,
    })
  },

})