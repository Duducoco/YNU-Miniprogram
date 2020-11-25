// pages/user/setting/setting.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
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

  infoSetting() {
    wx.navigateTo({
      url: './info/info',
    })
  },
  imgSetting() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log('res:', res)
        this.uploadImage(res.tempFilePaths);
      }
    })
  },
  // 上传照片
  uploadImage: function (imgs) {
    wx.showLoading({
      title: '上传图片中',
      mask: true
    })
    // TODO 照片上传至云存储
    const uploadTasks = imgs.map(item => {
      console.log("item:", item)
      return wx.cloud.uploadFile({
        cloudPath: `photos/${Date.now()}-${Math.floor(Math.random(0, 1) * 1000)}.png`,
        filePath: item
      })
    });
    Promise.all(uploadTasks).then(result => {
      this.addPhotos(result);
    }).catch(err => {
      console.log(err)
      wx.hideLoading();
      wx.showToast({
        title: '上传图片错误',
        icon: 'none'
      })
    })
  },
  // 添加图片数据至数据库
  async addPhotos(photos) {
    wx.showLoading({
      title: '添加图片中',
      mask: true
    })
    // 构造照片数据结构体，保存到数据库
    const albumPhotos = photos.map(photo => ({
      fileID: photo.fileID,
    }));
    let user=await db.collection('users').doc(app.globalData.id).get()
    this.removeImage(user.data.photo.filePath)
    db.collection('users').doc(app.globalData.id).update({
      data: {
        photo: {
          filePath: albumPhotos[0].fileID
        }
      }
    }).then(result => {
      console.log(result);
      wx.hideLoading();
      wx.showToast({
        title: '修改成功',
        icon: 'success'
      })
    })
  },
  // 删除图片
  removeImage:function(e){
    console.log(e)
    const that = this
    // TODO 照片删除功能
    wx.cloud.deleteFile({
      fileList: [e]
    })
  }
})