const app = getApp()
const db = wx.cloud.database()
const _ = db.command;

//时间数据的格式化
Date.prototype.format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
        date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    text: '',
    group: '无',
    index: 0,
    list: ['扫码签到', '待开发'],
    content: '',
    characterNum: 0,
    
    postUrl:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var myDate = new Date();
    var curtime = myDate.format('yyyy-MM-dd h:m:s')
    this.setData({
      isPickerRender: false,
    isPickerShow: false,
    startTime: curtime,
    endTime: curtime,
    pickerConfig: {
      endDate: true,
      column: "second",
      dateLimit: true,
      initStartTime: "2019-01-01 12:32:44",
      initEndTime: "2019-12-01 12:32:44",
      limitStartTime: "2015-05-06 12:32:44",
      limitEndTime: "2055-05-06 12:32:44"
    },
    })
  },
  pickerShow: function() {
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true
    });
  },
  pickerHide: function() {
    this.setData({
      isPickerShow: false,
      chartHide: false
    });
  },

  bindPickerChange: function(e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    console.log(this.data.sensorList);

    this.getData(this.data.sensorList[e.detail.value].id);
    // let startDate = util.formatTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7));
    // let endDate = util.formatTime(new Date());
    this.setData({
      index: e.detail.value,
      sensorId: this.data.sensorList[e.detail.value].id
      // startDate,
      // endDate
    });
  },
  setPickerTime: function(val) {
    console.log(val);
    let data = val.detail;
    this.setData({
      startTime: data.startTime,
      endTime: data.endTime
    });
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
  bindtype(e) {
    this.setData({
      index: e.detail.value
    })
  },
  textareaInput(e) {
    var that = this;
    if (e.detail.value.length > 140) {
      wx.showToast({
        title: '字数超限',
        duration: 1000,
        mask: true
      })
      setTimeout(function () {
        that.setData({
          content: ''
        })
      }.bind(that), 1000)
    } else {
      that.setData({
        content: e.detail.value,
        characterNum: e.detail.value.length
      })
    }

  },
  nameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  groupInput(e) {
    this.setData({
      group: e.detail.value
    })
  },
  async submit() {
    var that = this;
    if (that.data.name == "") {
      wx.showToast({
        title: '未输入名称',
        duration: 1200,
        icon: 'loading'
      })
      return;
    } else {
      let res = await db.collection('group').where({
        name: that.data.group
      }).get();
      console.log(res)
      if (that.data.group != '无' && res.data.length == 0) {
        wx.showToast({
          title: '不存在该部门',
          duration: 1200,
          icon: 'loading'
        })
        return;
      }
      
      var id = (await db.collection('qiandao').add({
        data: {
          info: {
            name: that.data.name,
            status: that.data.index,
            start: that.data.startTime,
            deadline: that.data.endTime,
            detail: that.data.content,
            group: that.data.group,
            owner: app.globalData.id
          },
          person:{}
        }
      }))._id;
      wx.showToast({
        title: '创建成功',
        duration: 500,
        icon: 'success'
      })
      app.globalData.qrid=id;
      wx.navigateTo({
        url: '../qrshow/qrshow',
      })
    }
  },


  
  
})