
const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
function get_object_first_attribute(data){
  for (var key in data)
      return key;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    tabOne: true,
    borderOne: 'orange',
    colorOne: 'black',
    borderTwo: '#999999',
    colorTwo: '#999999',
    windowHeight: wx.getSystemInfoSync().windowHeight,
    width: '100',
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
    var that = this;
    this.init()
  },
  async init(){
    var that = this;
    let res=await db.collection('juge').get()
    console.log(res)
    //判断是否为团队申请
    var ans=[];
    for(var i=0;i<res.data.length;i++){
      if(res.data[i].type==0){
        var tmp=get_object_first_attribute(res.data[i].group.person);
        var x={
          id1:res.data[i]._id,
          name1:res.data[i].group.name,
          id2:tmp,
          name2:res.data[i].group.person[tmp].name
        } 
        ans.push(x)
      }
    }
    that.setData({
      list:ans
    })
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
  async confirm(e) {
    var that = this;
    let user=await db.collection('users').doc(e.currentTarget.dataset.id2).get()
    let juge=await db.collection('juge').doc(e.currentTarget.dataset.id1).get()
    var tmp=juge.data.group.person
    for(var i in tmp){
      tmp[i].pos='部长'
    }
    let id=(await db.collection('group').add({
      data:{
        name:juge.data.group.name,
        desc:juge.data.group.desc,
        person:tmp,
        total:juge.data.group.total,
      }
    }))._id;
    await db.collection('users').doc(e.currentTarget.dataset.id2).update({
      data:{
        info:{
          group:juge.data.group.name,
          pos:'部长',
          group_id:id
        }
      }
    });
    await db.collection('juge').doc(e.currentTarget.dataset.id1).remove({
      success: res => {
        wx.showToast({
          title: '已同意',
        })
        this.init()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '同意失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },
  async cancel(e) {
    var that = this;
    console.log(e)
    await db.collection('users').doc(e.currentTarget.dataset.id2).update({
      data:{
        info:{
          group:''
        }
      }
    })
    await db.collection('juge').doc(e.currentTarget.dataset.id1).remove({
      success: res => {
        wx.showToast({
          title: '已拒绝',
        })
        this.init()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '拒绝失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })

  }

})