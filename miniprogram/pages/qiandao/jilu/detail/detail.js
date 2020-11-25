
var app = getApp()
const db = wx.cloud.database()
const _ = db.command;
Page({

    /**
     * 页面的初始数据
     */
    data: {
      list:{},
      stuff:[],
      qrid: '',//jilu传值
      owner: '',
      project: '',
      manager: '',
      resources: '',
      tabOne: true,
      tabTwo: false,
      actionSheetHidden: true,
      bordercolor1: 'orange',
      color1: 'black',
      bordercolor2: '#999999',
      color2: '#999999',
      actionSheetItems: ['无']
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
      var that=this;
      console.log(options)
      this.setData({
        qrid:options.qrid
      })
      let qd = await db.collection('qiandao').doc(options.qrid).get()
      console.log(qd)
      
      let tmp = await db.collection('users').doc(qd.data.info.owner).get();
      
      var ans=[];
      var cnt=0;
      for(var i in qd.data.person){
        var j=qd.data.person[i];
        let tmp = await db.collection('users').doc(i).get()
        console.log(tmp)
        var name=tmp.data.info.name
        ans.push({cnt,name,j})
        cnt++;
      }
      that.setData({
        list: qd.data,
        owner:tmp.data.info.name,
        stuff:ans
      })
      console.log(that.data.stuff)
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
        color1: 'black',
        bordercolor1: 'orange',
        color2: '#999999',
        bordercolor2: '#999999'
      })
    },
    tabTwo() {
      var that = this;
      that.setData({
        tabOne: false,
        tabTwo: true,
        color1: '#999999',
        bordercolor1: '#999999',
        color2: 'black',
        bordercolor2: 'orange'
      })
  
    },
    nameInput(e) {
      var tmp=this.data.list;
      tmp.info.name=e.detail.value
      this.setData({
        list: tmp
      })
    },
    bindEndDateChange(e) {
      var tmp=this.data.list;
      tmp.info.deadline=e.detail.value+tmp.info.deadline.substring(10,tmp.info.deadline.length)
      this.setData({
        list: tmp
      })
    },
    bindStartDateChange(e) {
      var tmp=this.data.list;
      tmp.info.start=e.detail.value+tmp.info.start.substring(10,tmp.info.start.length)
      this.setData({
        list: tmp
      })
    },
    detailInput(e) {
      var tmp=this.data.list;
      tmp.info.detail=e.detail.value
      this.setData({
        list: tmp
      })
    },
    qrcode(){
      app.globalData.qrid=this.data.qrid;
      wx.navigateTo({
        url: '../../qrshow/qrshow',
      })
    },
    async entered() {
      var that=this;
      console.log(that.data.qrid)
      await db.collection('qiandao').doc(that.data.qrid).update({
        data:{
          info:that.data.list.info,
          person:that.data.list.person
        },
        success:function(res){
          wx.showToast({
            title: '保存成功',
            icon:'success'
          })
        },
        fail:function(res){
          console.log(res)
          wx.showToast({
            title: '保存失败',
            icon:'none'
          })
        }
      })
    },
    actionSheetTap: function(e) {//菜单弹出
      var that=this
      console.log(e)
      this.setData({
        actionSheetItems: that.data.stuff[e.currentTarget.id].j.time,
        actionSheetHidden: !this.data.actionSheetHidden
      })
    },
    actionSheetChange: function(e) {//菜单隐藏
      this.setData({
        actionSheetHidden: !this.data.actionSheetHidden
      });
    },
  })