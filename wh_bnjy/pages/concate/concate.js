// we7_wxappsample/pages/concate/concate.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    renshu: 1,
    cityarr: [],
    zxkind: [],
    defaultcity: "武汉",
    defaultzxkind: "选择服务类型"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var num = Math.random() * 50 + 20;//显示每天给多少人测算过了
    var num = parseInt(num);
    _this.setData({
      renshu: num
    });
    //加载出有多少个装修类型
    app.util.request({
      url: "entry/wxapp/getzxkind",
      success(res) {
        _this.setData({
          zxkind: res.data.data
        })
      }
    })
  },
  onPickChange: function (e) {
    var _this = this;
    var area = e.detail.value;
    _this.setData({
      defaultcity: ""
    })
    for (var i = 0; i < area.length; i++) {
      var middarea = area[i];
      this.setData({
        defaultcity: _this.data.defaultcity + middarea
      })
    }

  },
  onPickChangekind: function (e) {
    var data = e.detail.value;
    var realdata = this.data.zxkind[data];
    this.setData({
      defaultzxkind: realdata
    })
  },
  onFormSubmit: function (e) {
    var _this = this;
    var city = e.detail.value.city;
    var massage = e.detail.value.massage;
    var area = e.detail.value.area;
    var housekind = e.detail.value.kind;
    var mobile = e.detail.value.mobile;
    var name = e.detail.value.name;
    if (city == "" || city == null) {
      wx.showModal({
        title: '温馨提示',
        content: '城市名称不可为空',
      })
      return;
    } else if (housekind == "" || housekind == null) {
      wx.showModal({
        title: '温馨提示',
        content: '服务类型不能为空，请您重新输入',
      })
      return;
    } else if (area == "" || area == null) {
      wx.showModal({
        title: '温馨提示',
        content: '具体地址不能为空，请您重新输入',
      })
      return;
    } else if (mobile == "" || mobile == null) {
      wx.showModal({
        title: '温馨提示',
        content: '电话号码格式不正确，请您重新输入',
      })
      return;
    } else if (name == "" || name == null) {
      wx.showModal({
        title: '温馨提示',
        content: '姓名不能为空，请您重新输入',
      })
      return;
    }
    //不管是否最终支付10元，都会将实际留言存入数据库
    wx.showModal({
      title: '温馨提示',
      content: "支付10元诚意金，金牌师傅免费上门服务（可退款）",
      success(res) {
        if (res.confirm) {
          //确定后直接进入支付页面
          wx.login({
            success(res) {
              var code = res.code;
              app.util.request({
                'url': 'entry/wxapp/pay', //调用wxapp.php中的doPagePay方法获取支付参数
                data: {
                  code: code,
                  fee: 0.01,
                  userimg: wx.getStorageSync("avatarUrl"),
                  username: wx.getStorageSync("nickname"),
                  productname: _this.data.defaultzxkind,
                  phone: mobile
                },
                'cachetime': '30',
                success(res) {
                  //发起支付
                  wx.requestPayment({
                    'timeStamp': res.data["timeStamp"],
                    'nonceStr': res.data["nonceStr"],
                    'package': res.data["package"],
                    'signType': 'MD5',
                    'paySign': res.data["paySign"],
                    'success': function (res) {
                      //执行支付成功提示
                      console.log(res);
                    },
                    'fail': function (res) {
                      console.log(res);
                    }
                  })

                },
                fail(res) {
                  wx.showModal({
                    title: '系统提示',
                    content: res.data.message ? res.data.message : '错误',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {

                      }
                    }
                  })
                }
              })
            }
          })

        } else if (res.cancel) {
          wx.showToast({
            title: '提交成功！',
          })
        }
      }

    })
    app.util.request({
      url: "entry/wxapp/insertquery",
      data: {
        city: city,
        area: area,
        housekind: housekind,
        mobile: mobile,
        name: name,
        massage: massage,
        formid: e.detail.formId,
        nickname: wx.getStorageSync('nickname'),
        avatarUrl: wx.getStorageSync('avatarUrl')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res);
      }
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
  goTop: function (e) {
    wx.pageScrollTo ? wx.pageScrollTo({
      scrollTop: 0
    }) : wx.showModal({
      title: "提示",
      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
    });
  },
})