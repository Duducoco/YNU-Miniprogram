
const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
function get_object_first_attribute(data) {
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
  async init() {
    var that = this;
    let res = await db.collection('juge').get()
    let user = await db.collection('users').doc(app.globalData.id).get()
    console.log(res)
    //判断是否为入部申请
    var ans = [];
    //超级管理员
    if (user.data.admin == 2) {
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].type == 1) {
          var tmp = get_object_first_attribute(res.data[i].ap.person);
          var x = {
            id1: res.data[i]._id,
            group_id: res.data[i].ap.group_id,
            name1: res.data[i].ap.group,
            id2: tmp,
            name2: res.data[i].ap.person[tmp].name
          }
          ans.push(x)
        }
      }
    } else {//部级管理员
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].type == 1 && user.data.info.group == res.data[i].ap.group) {
          var tmp = get_object_first_attribute(res.data[i].ap.person);
          var x = {
            id1: res.data[i]._id,
            group_id: res.data[i].ap.group_id,
            name1: res.data[i].ap.group,
            id2: tmp,
            name2: res.data[i].ap.person[tmp].name
          }
          ans.push(x)
        }
      }
    }

    that.setData({
      list: ans,
      apply: user.data.apply.group
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
    let user = await db.collection('users').doc(e.currentTarget.dataset.id2).get()
    let juge = await db.collection('juge').doc(e.currentTarget.dataset.id1).get()
    var tmp = user.data.apply.group;
    var index = get_object_first_attribute(juge.data.ap.person)
    await db.collection('group').doc(juge.data.ap.group_id).update({
      data: {
        person: {
          [index]: juge.data.ap.person[index]
        },
        total: juge.data.ap.total + 1
      }
    });
    var id = await db.collection('juge').where({
      _openid: user.data._openid
    }).get();
    console.log(id)
    for (var j = 0; j < id.data.length; j++) {
      console.log(id.data[j])
      if (id.data[j].type == 1) {

        await db.collection('juge').doc(id.data[j]._id).remove({})
      }
    }

    await db.collection('users').doc(e.currentTarget.dataset.id2).update({
      data: {
        info: {
          group: juge.data.ap.group,
          pos: '干事',
          group_id: juge.data.ap.group_id
        },
        apply: {
          group: []
        }
      },
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
      }
    });
  },
  async cancel(e) {
    var that = this;
    console.log(e)
    var apply = that.data.apply
    var index = apply.indexOf(e.currentTarget.dataset.group_id)
    apply.splice(index, 1)
    await db.collection('users').doc(e.currentTarget.dataset.id2).update({
      data: {
        apply: {
          group: apply
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