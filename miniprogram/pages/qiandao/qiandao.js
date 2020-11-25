const app = getApp();
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
    data: {
        buttonImg: 'cloud://wxproject-6gpwqom7fdf8cec0.7778-wxproject-6gpwqom7fdf8cec0-1304009470/图片/button1.png',
        sceneId: null
    },
    //按下按钮开始
    touchstart: function () {
        let that = this;
        that.setData({
            buttonImg: 'cloud://wxproject-6gpwqom7fdf8cec0.7778-wxproject-6gpwqom7fdf8cec0-1304009470/图片/button2.png'
        });
        wx.scanCode({
            onlyFromCamera: 'true',
            success: function (res) {
                console.log('success:', res);
                that.setData({
                    buttonImg: 'cloud://wxproject-6gpwqom7fdf8cec0.7778-wxproject-6gpwqom7fdf8cec0-1304009470/图片/button1.png'
                });
                that.dealres(res.result);
            },
            fail: function (res) {
                console.log('fali:', res);
                that.setData({
                    buttonImg: 'cloud://wxproject-6gpwqom7fdf8cec0.7778-wxproject-6gpwqom7fdf8cec0-1304009470/图片/button1.png'
                });
            }
        });
    },
    //按下按钮结束
    touchend: function () {
        this.setData({
            buttonImg: 'cloud://wxproject-6gpwqom7fdf8cec0.7778-wxproject-6gpwqom7fdf8cec0-1304009470/图片/button1.png'
        });
    },

    onLoad: function (options) {

    },
    onShow: function () {

    },
    onHide: function () {

    },
    //处理扫码结果
    dealres: async function (res) {
        let jilu = await db.collection('qiandao').doc(res).get();
        let user = await db.collection('users').doc(app.globalData.id).get();
        console.log(user)
        console.log(app.globalData.id)
        //获取当前时间
        var myDate = new Date();
        var curtime = myDate.format('yyyy-MM-dd h:m:s')

        if (jilu.data.length == 0) {
            wx.showToast({
                title: '无效签到码',
                icon: 'loading'
            })
        } else {
            if (jilu.data.info.group != '无' && jilu.data.info.group != user.data.info.group) {
                wx.showToast({
                    title: '非签到部门内',
                    icon: 'loading'
                })
            } else if (jilu.data.info.status == -1) {
                wx.showToast({
                    title: '签到已停止',
                    icon: 'loading'
                })
            } else if (jilu.data.info.start > curtime) {
                wx.showToast({
                    title: '签到未开始',
                    icon: 'loading'
                })
            } else if (jilu.data.info.deadline < curtime) {
                wx.showToast({
                    title: '签到已结束',
                    icon: 'loading'
                })
            }
            else {
                //判断是否签到过，是则次数+1，否则创建新字段，次数为1
                if (app.globalData.id in jilu.data.person) {//签过
                    jilu.data.person[app.globalData.id].num++;
                } else {
                    jilu.data.person[app.globalData.id]= {};
                    jilu.data.person[app.globalData.id]['num']=1;
                    jilu.data.person[app.globalData.id]['time']=[];
                }
                
                jilu.data.person[app.globalData.id]['time'].unshift(curtime);
                //更新数据库
                await db.collection('qiandao').doc(res).update({
                    data: {
                        info:jilu.data.info,
                        person:jilu.data.person
                    },
                    success: async function (res) {
                        console.log(res)
                    },
                    fali:function(res){
                        console.log(res)
                    }
                });
                if (jilu.data._id in user.data.qiandao) {//签过
                    user.data.qiandao[jilu.data._id].num=jilu.data.person[app.globalData.id].num;
                } else {
                    user.data.qiandao[jilu.data._id]= {};
                    user.data.qiandao[jilu.data._id]['num']=jilu.data.person[app.globalData.id].num;
                    user.data.qiandao[jilu.data._id]['name']=jilu.data.info.name;
                }
                await db.collection('users').doc(app.globalData.id).update({
                    data: {
                        qiandao:user.data.qiandao
                    },
                    success: function (res) {
                        wx.showToast({
                            title: '签到成功',
                            icon: 'success'
                        })
                    },
                    fali:function(res){
                        wx.showToast({
                            title: '签到失败',
                            icon: 'loading'
                        })
                    }
                })
                

            }
        }
    }
})