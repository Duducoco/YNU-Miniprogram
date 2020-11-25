// pages/group/groupdetail/groupdetail.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuff: [],
    actionSheetHidden: true,
    actionSheetHidden2: true,
    actionSheetItems: ['无'],
    person: {},
    id: '',//group传值
    tabOne: true,
    tabTwo: false,
    bordercolor1: 'orange',
    color1: 'black',
    bordercolor2: '#999999',
    color2: '#999999',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    this.setData({
      options: options
    })
  },
  async init() {
    var that = this
    var options = that.data.options
    let group = await db.collection('group').doc(options.id).get()
    let user = await db.collection('users').doc(app.globalData.id).get()
    console.log(group)
    var teamName = group.data.name;
    var name = '';
    var name1 = [];
    var desc = group.data.desc;
    var total = group.data.total;
    //button
    var bindName = '';
    var ctr = true;
    var buttonName = '';
    //stuff
    var person = group.data.person;
    console.log(person)
    var ans = [];
    var headImg = '';
    var userName
    var pos = '';
    var id = '';
    //button2
    var ctr1 = true;
    var ctr2 = true;
    var ctr3 = true;
    //按钮数据清洗
    if (user.data.info.group == teamName) {
      if (user.data.info.pos == '部长') {
        ctr1 = false, ctr2 = false, ctr3 = ctr = false
        bindName = 'saveSet';
        buttonName = '保存修改'
      }
      if (user.data.info.pos == '副部长') {
        ctr2 = false, ctr3 = ctr = false
        bindName = 'saveSet';
        buttonName = '保存修改'
      }
    } else if (user.data.info.group == '' && !user.data.apply.group.includes(options.id)) {
      ctr = false
      bindName = 'entered';
      buttonName = '申请加入'
    }
    //成员信息清洗
    for (var i in person) {
      //部门负责人数据清洗
      if (person[i].pos == '部长') {
        name = person[i].name
      } else if (person[i].pos == '副部长') {
        name1.push(person[i].name)
      }
      //姓名 职务 id 数据清洗
      userName = person[i].name
      pos = person[i].pos;
      if(pos=='') pos='干事'
      id = i;
      //头像数据
      let tmp = await db.collection('users').doc(id).get()
      console.log(tmp)
      headImg = tmp.data.photo.filePath
      ans.push({
        headImg: headImg,
        userName: userName,
        pos: pos,
        id: id
      })

    }
    that.setData({
      person:group.data.person,
      teamId: options.id,
      teamName: teamName,
      name: name,
      name1: name1,
      desc: desc,
      total: total,
      bindName: bindName,
      ctr: ctr,
      ctr3: ctr3,
      buttonName: buttonName,
      ctr1: ctr1,
      ctr2: ctr2,
      stuff: ans
    })
    console.log(that.data)
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
    this.init()
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
  saveSet: function () {
    var that = this
    db.collection('group').doc(that.data.teamId).update({
      data: {
        desc: that.data.desc
      },
      success: function (res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
      },
      fail() {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })
  },
  detailInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  entered: async function () {
    var that = this
    //更新个人申请
    var userid = app.globalData.id;
    await db.collection('users').doc(app.globalData.id).update({
      data: {
        apply: {
          group: _.push(that.data.teamId)
        }
      }
    })
    //创建申请信息
    let user = await db.collection('users').doc(app.globalData.id).get()
    var tmp = {};
    tmp[userid] = {};
    tmp[userid] = user.data.info;
    await db.collection('juge').add({
      data: {
        type: 1,//表示团队申请
        ap: {
          group: that.data.teamName,
          total: that.data.total,
          group_id: that.data.teamId,
          person: tmp
        }
      },
      success() {
        wx.showToast({
          title: '申请成功',
          icon: 'success'
        })
        that.init()
      },
      fail() {
        wx.showToast({
          title: '申请失败',
          icon: 'none'
        })
      }
    })
    this.init()
  },
  async confirm(e) {//任命职务或转让部长
    var that = this;
    let user=await db.collection('users').doc(e.currentTarget.id).get()
    if(user.data.info.pos=='部长'||user.data.info.pos=='副部长'){
      wx.showToast({
        title:'权限不足',
        icon:'none'
      })
      return;
    }
    this.actionSheetTap2(e.currentTarget.id)
  },
  cancel:async function(e) {//踢出团队
    var that =this
    let user=await db.collection('users').doc(e.currentTarget.id).get()
    if(user.data.info.pos=='部长'||user.data._id==app.globalData.id){
      wx.showToast({
        title:'权限不足',
        icon:'none'
      })
      return;
    }
    wx.showModal({
      title:'提示',
      content:'确定要将此人移出部门吗？',
      success:async function(res){
        if(res.confirm){
          //更新个人记录
          await db.collection('users').doc(e.currentTarget.id).update({
            data:{
              info:{
                group:'',
                pos:''
              }
            }
          })
          //更新团队记录
          var person=that.data.person
          delete person[e.currentTarget.id]
          await db.collection('group').doc(that.data.teamId).update({
            data:{
              person:person,
              total:that.data.total-1
            },
            success(){
              wx.showToast({
                title: '已移出',
              })
            }
          })
          that.init()
        }
      }
    })
  },
  actionSheetTap: async function (e) {//菜单弹出
    var that = this
    console.log(e.currentTarget.id)
    let user=await db.collection('users').doc(e.currentTarget.id).get()
    console.log(user)
    user=user.data.info;
    var ans=[];
    ans.push('姓名：'+user.name);
    if(user.sex=='0')
      ans.push('性别：'+'男')
    else if(user.sex=='1')  ans.push('性别：'+'女')
    ans.push('学号：'+user.num)
    ans.push('专业：'+user.major)
    ans.push('联系电话：'+user.phone)
    ans.push('部门：'+user.group)
    ans.push('职务：'+user.pos)

    this.setData({
      actionSheetItems: ans,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetChange: function (e) {//菜单隐藏
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  async actionSheetTap2(e) {//菜单弹出
    var that = this
    console.log(e)
    var ans=['部长','副部长','干事'];
    this.setData({
      curid:e,
      actionSheetItems: ans,
      actionSheetHidden2: !this.data.actionSheetHidden2
    })
  },
  actionSheetChange2: function (e) {//菜单隐藏
    this.setData({
      actionSheetHidden2: !this.data.actionSheetHidden2
    });
  },
  bind0:function(e){//部长转让
    var that=this
    this.actionSheetChange2()
    wx.showModal({
      content:'是否确定转移部长职务?',
      async success(res){
        if(res.cancel) return;
        //更新当前部长信息
        await db.collection('users').doc(app.globalData.id).update({
          data:{
            admin:0,
            info:{
              pos:'干事'
            }
          }
        })
        //更新现部长信息
        await db.collection('users').doc(e.currentTarget.id).update({
          data:{
            admin:1,
            info:{
              pos:'部长'
            }
          }
        })
        //更新团队信息
        await db.collection('group').doc(that.data.teamId).update({
          data:{
            person:{
              [app.globalData.id]:{
                pos:'干事'
              },
              [e.currentTarget.id]:{
                pos:'部长'
              }
            }
          },
          success(){
            wx.showToast({
              title: '部长转让成功',
              icon:'success'
            })
            that.init()
          },
          fail(){
            wx.showToast({
              title: '职务变更失败',
              icon:'none'
            })
          }
        })
      }
    })
  },
  bind1:async function(e){//委任副部
    var that=this
    this.actionSheetChange2()
    if(that.data.name1.length==2){
      wx.showToast({
        title: '副部长职位已满',
        icon:'none'
      })
      return;
    }
    wx.showModal({
      content:'是否任命为副部长?',
      async success(res){
        if(res.cancel) return;
        //更新副部长信息
        await db.collection('users').doc(e.currentTarget.id).update({
          data:{
            admin:1,
            info:{
              pos:'副部长'
            }
          }
        })
        //更新团队信息
        await db.collection('group').doc(that.data.teamId).update({
          data:{
            person:{
              [e.currentTarget.id]:{
                pos:'副部长'
              }
            }
          },
          success(){
            wx.showToast({
              title: '任命副部长成功',
              icon:'success'
            })
            that.init()
          },
          fail(){
            wx.showToast({
              title: '职务变更失败',
              icon:'none'
            })
          }
        })
      }
    })
  },
  bind2:async function(e){//变更为干事职务
    var that=this
    this.actionSheetChange2()
    wx.showModal({
      content:'是否变更职务为干事?',
      success(res){
        if(res.cancel) return;
        //更新部员信息
        db.collection('users').doc(e.currentTarget.id).update({
          data:{
            admin:0,
            info:{
              pos:'干事'
            }
          }
        })
        //更新团队信息
        db.collection('group').doc(that.data.teamId).update({
          data:{
            person:{
              [e.currentTarget.id]:{
                pos:'干事'
              }
            }
          },
          success(res){
            wx.showToast({
              title: '变更职务为干事',
              icon:'success'
            })
            that.init()
          },
          fail(){
            wx.showToast({
              title: '职务变更失败',
              icon:'none'
            })
          }
        })
      },
    })
  },
})