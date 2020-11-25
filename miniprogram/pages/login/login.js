//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
const _ = db.command;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    wx.showLoading({
      title: '初始化中',
      mask: true
     });
  },
  onShow() {
    this.init();
  },
  async init() {
    //1. 从用户集合中取出当前用户信息
    
    let result = await db.collection('users').where({ _openid: app.globalData.openid }).get();
    console.log('result:', result)
    if (result.data.length == 0) {
        // 当前用户第一次登录，集合中无用户信息，插入当前用户信息记录，并在全局存储docId
        wx.hideLoading();        
    } else {
        // 能取到当前用户信息，直接取出用户的照片数据进行渲染
        app.globalData.id = result.data[0]._id;
        console.log("id:",app.globalData.id)
        this.setData({
             photo: result.data[0].photo
        })
    }
    wx.hideLoading();
  },
  getUserInfo: async function(e) {
    
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    console.log("info:",e.detail.userInfo)
    app.globalData.id = (await db.collection('users').add({
      data:{
        admin:0,
        info: {
          name: e.detail.userInfo.nickName,
          sex: '',
          phone: '',
          num: '',
          major: '',
          group: '',
          group_id:'',
          pos: ''
        },
        photo: {
          filePath: e.detail.userInfo.avatarUrl
        },
        qiando:{},
        apply:{
          group:[],
          room:[]
        }
      }
    }))._id;
    // this.uploadImage(e.detail.userInfo.avatarUrl)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.navigateTo({
      url: '../user/setting/info/info',
    })
  },


})
