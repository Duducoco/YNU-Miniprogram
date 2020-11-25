## 部署教程

### 下载代码

GitHub链接：https://github.com/zgMin/BWQSB

### 将代码导入开发者工具

![daoru.jpg](https://i.loli.net/2020/11/13/ZhzJB2RqK7EFvso.jpg)

目录选择app.js所在文件夹

APPID填自己的，开通云开发之后进行配置

### 部署云函数

暂未使用云函数

### 参数修改

在app.js中初始化数据库时

![env.jpg](https://i.loli.net/2020/11/13/6qO4ZEXRsmUve8A.jpg)

参数env的值为云数据库的环境ID

![yun.jpg](https://i.loli.net/2020/11/13/OJChFRji1QZYBLH.jpg)

### 云数据库的数据创建

需要创建6个数据集合

&emsp; qiandao集：用于存储签到的信息，权限为全部可读写

![qiandao.jpg](https://i.loli.net/2020/11/13/SklrKqbPxLhnvER.jpg)

&emsp; group集：用于存储部门的信息，权限为全部可读写

![group.jpg](https://i.loli.net/2020/11/13/HYPruXEjTN5oRQi.jpg)

&emsp; juge集：用于存储申请（包括部门创建、入部申请、场地申请等）的信息，权限为全部可读写

 ![juge_applygroup.jpg](https://i.loli.net/2020/11/13/bqLDrgZ9AdGBJe8.jpg) 
 
 ![juge_creategroup.jpg](https://i.loli.net/2020/11/13/P2zV6NG4EHy9Bap.jpg)
 
&emsp; users集：用于存储用户的信息，权限为‘所有用户可读，仅创建者可读写’

![users.jpg](https://i.loli.net/2020/11/13/1WQCE8IUYguy9ej.jpg)

&emsp; news集：用于存储消息的信息，权限为‘所有用户可读，仅创建者可读写’

 ![news.jpg](https://i.loli.net/2020/11/13/5QedsacfBA7p4So.jpg)
 
&emsp; getId集：用来临时创建记录，获取用户openid，权限为‘仅创建者可读写’

&emsp;&emsp; &emsp;&emsp;    getId集用于临时建立记录获取openid，无具体结构

### 云存储中上传的文件

图标、图片文件上传至云存储的图片文件夹中

![QQ图片20201113155055.png](https://i.loli.net/2020/11/13/KCU5NfcbnDZR4gx.png)

### 后台服务配置

通过手动修改users集合中记录来获得超级管理员权限的账号
修改记录的部分字段
data{

&emsp;&emsp;admin:2,

&emsp;&emsp;info:{

&emsp;&emsp;&emsp;&emsp;group:’管理组’,

&emsp;&emsp;&emsp;&emsp;pos:’管理员’

&emsp;&emsp;}

}