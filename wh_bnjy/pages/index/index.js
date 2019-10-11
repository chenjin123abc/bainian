// we7_wxappdemo/pages/index/index.js
import http from '../../util/request.js';
const app = getApp();
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    information: [
      { textUrl: '国庆优惠来啦！' },
      { textUrl: '预约询价后即可获得优惠!'},
      { textUrl: '来百年基业，享最低折扣！' }
    ],
    code: "", //这是获取手机号需要的code，存在这里
    onOff: "none",
    phoneon: "none",
    zhuangxiutitle: "",
    weixiutitle: "",
    list: [],
    type: [{
        img: "https://www.whbnjy.top/attachment/images/banner/1.jpg",
        name: "在线报价",
        id: 1
      },

      {
        img: "https://www.whbnjy.top/attachment/images/banner/4.jpg",
        name: "项目展示",
        id: 2
      },
      {
        img: "https://www.whbnjy.top/attachment/images/banner/3.jpg",
        name: "关于我们",
        id: 3
      },
    ],
    galler: [],
    weixiu: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    //检验登录状态
    wx.getSetting({
      success: function(res) {
        // console.log(res.authSetting);
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            onOff: "none",
          })
          wx.getUserInfo({
            success: function(res) {
              var avatarUrl = res.userInfo.avatarUrl;
              var userName = res.userInfo.nickName;
              app.globalData.nickname = userName;
              app.globalData.avatarUrl = avatarUrl;
            }
          });
        } else {
          _this.setData({
            onOff: "true",
          })
        }
      }
    });
    //检验完登录状态后，需要请求数据库拿到数据
    app.util.request({
      url: "entry/wxapp/getproduct",
      success(res) {
        var data = res.data.data;
        for (var i = 0; i < data.length; i++) {
          if (i == 0) {
            //先给第一个命名
            var zhuangxiutitle = data[i].name
            _this.setData({
              zhuangxiutitle: zhuangxiutitle //装修名字的赋值
            });
            var product = data[0].product;
            for (var j = 0; j < product.length; j++) {
              var onedata = product[j];
              var objmidd = {
                id: onedata.id,
                name: onedata.name,
                img: onedata.proimg
              };
              _this.setData({
                galler: _this.data.galler.concat(objmidd)
              })
            };
          } else if (i == 1) {
            //给第二个数组命名
            var zhuangxiutitle = data[i].name
            _this.setData({
              weixiutitle: zhuangxiutitle //装修名字的赋值
            });
            var product = data[i].product;
            for (var j = 0; j < product.length; j++) {
              var twodata = product[j];
              var objmidd = {
                id: twodata.id,
                name: twodata.name,
                img: twodata.proimg
              };
              _this.setData({
                weixiu: _this.data.weixiu.concat(objmidd)
              })
            }
          }
        }
      }
    });
    //首页的banner
    app.util.request({
      url:"entry/wxapp/getmenu",
      success(res){
        _this.setData({
          information:[]
        })
        var bannerimg = res.data.data.bannerimg;
        var notice = res.data.data.notice;
        for (var i = 0; i < bannerimg.length;i++){
          var middobj={
            img: bannerimg[i]
          }
          _this.setData({
            list: _this.data.list.concat(middobj)
          })
        }
        for (var i = 0; i < notice.length; i++) {
          var middobj = {
            textUrl: notice[i]
          }
          _this.setData({
            information: _this.data.information.concat(middobj)
          })
        }
      }
    });
  },
  bindgaller:function(t){
    var id = t.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../casedetail/casedetail?pid=" + id
    });
  },
  hiddenphone:function(){
    this.setData({
      phoneon: "none"
    })
  },
  getUserPhone: function(e) {
    this.setData({
      phoneon: "none"
    })
    var _this = this;
    var iv = e.detail.iv
    var encryptedData = e.detail.encryptedData

    app.util.request({
      url: "entry/wxapp/getuserphone",
      data: {
        code: _this.data.code,
        encryptedData: encryptedData,
        iv: iv,
        nickname: wx.getStorageSync('nickname'),
        avatarUrl: wx.getStorageSync('avatarUrl')
      },
      success(res) {
        var phone = res.data.data.phonenum;
        if (phone !== "" || phone != null) {
          wx.setStorageSync("phone", res.data.data.phonenum);
        }

      }
    })

  },
  hiddenuser:function(){
    var _this = this;
    _this.setData({
      onOff: "none",
      phoneon: "true"
    });
  },
  onGotUserInfo: function(e) {
    var _this = this;
    _this.setData({
      onOff: "none",
      phoneon: "true"
    });
    wx.login({
      success(res) {
        _this.setData({
          code: res.code
        })
      }
    });
    app.globalData.nickname = e.detail.userInfo.nickName;
    app.globalData.avatarUrl = e.detail.userInfo.avatarUrl;
    wx.setStorageSync("nickname", app.globalData.nickname);
    wx.setStorageSync("avatarUrl", app.globalData.avatarUrl);

  },
  bindType:function(e){
    var id=e.currentTarget.dataset.id;
    var _this=this;
    if(id==1){
      wx.navigateTo({
        url: '../baojia/baojia',
      })
    }else if(id==2){
      wx.navigateTo({
        url: '../case/case',
      })
    }else{
      wx.navigateTo({
        url: '../about/about',
      })
    }
    
    
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})