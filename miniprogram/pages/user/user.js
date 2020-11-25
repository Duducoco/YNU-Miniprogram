const app = getApp()
const db = wx.cloud.database()
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    this.setData({
      result:await db.collection("users").where({_openid:app.globalData.openid}).get()
    })
    var result = this.data.result;
    if(result.data.length!=0){
      //用户信息存在，则直接设置数据
        app.globalData.openid=result.data[0]._openid;
        this.setData({
          nickname: result.data[0].info.name,
          head_img: result.data[0].photo.filePath
        })
    }else{
      wx.navigateTo({
        url: 'pages/login/login',
      })
    }
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

  toFeedback() {
    wx.navigateTo({
      url: './feedback/feedback',
    })
  },

  toJilu() {
      wx.navigateTo({
        url: '../qiandao/jilu/jilu',
      })
  },

  async toGroup() {
      let user=await db.collection('users').doc(app.globalData.id).get()
      if(user.data.info.group==''){
        wx.showToast({
          title: '未加入部门',
          icon:'none'
        })
        return;
      }
      wx.navigateTo({
        url: '../group/groupdetail/groupdetail?id='+user.data.info.group_id,
      })
  },

  toAdmin() {
  
    if (this.data.result.data[0].admin == 0) {
      wx.showToast({
        title: '权限不足',
        icon: 'loading',
        duration: 1000,
      })
    } else {
      wx.navigateTo({
        url: './admin/admin?admin='+this.data.result.data[0].admin,
      })
    }
  },

  setting() {
    wx.navigateTo({
      url: './setting/setting',
    })
  }
})