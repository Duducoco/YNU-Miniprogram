// pages/test/test.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    desc: '',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  nameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  descInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  async createGroup() {
    var that=this;
    if(that.data.name==''){
      wx.showToast({
        title: '部门名称为空',
        icon:'none'
      })
      return;
    }
    let user=await db.collection('users').doc(app.globalData.id).get()
    console.log(user)
    //判断是否已有团队
    if(user.data.info.group=='申请中'){
      wx.showToast({
        title: '已有申请',
        icon:'none'
      })
      return;
    }else if(user.data.info.hasOwnProperty('group')){
      if(user.data.info.group!=''){
        wx.showToast({
          title: '已有团队',
          icon:'none'
        })
        return;
      }
    }

    //未有团队
    var tmp={};
    tmp[user.data._id]={};
    tmp[user.data._id]=user.data.info
    await db.collection('juge').add({
      data:{
        type:0,//表示团队创建审核
        group:{
          name:that.data.name,
          desc:that.data.desc,
          person:tmp,
          total:1,
          status:0
        },
      },
      success:function(res){
        db.collection('users').doc(app.globalData.id).update({
          data:{
            info:{
              group:'申请中'
            }
          },
          success(){
            wx.showToast({
              title: '已提交申请',
              icon: 'success',
            })
          }
        })
      },
      fail:function(res){
        wx.showToast({
          title: '提交失败',
          icon:'none'
        })
      }
    })
    
  }
})