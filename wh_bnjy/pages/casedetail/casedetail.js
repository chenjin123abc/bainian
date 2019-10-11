var app = getApp();
var WxParse = require("../../../wxParse/wxParse.js");

Page({
  data: {
    productDetail: [],
    Carousel:[]
  },
  onLoad: function (t) {
    var _this = this, e = t.pid;
    app.util.request({
      url: "entry/wxapp/getproductdetail",
      data: {
        pid: e
      },
      success: function (t) {
        var data=t.data.data.productlist;
        for(var i=0;i<data.length;i++){
          var objmidd={
            title:data[i].name,
            cover:data[i].proimg,
            id:data[i].id
          }
          _this.setData({
            productDetail: _this.data.productDetail.concat(objmidd)
          })
        }
        _this.setData({
          Carousel: _this.data.Carousel.concat({ src: t.data.data.img }),
        });
        WxParse.wxParse("article", "html", t.data.data[0].content, _this, 5)
      }
    });
  },
  intoProductDetail: function (a) {
    var id = a.currentTarget.dataset.pid;
    wx.navigateTo({
      url: "../casedetail/casedetail?pid=" + id
    });
  },
  
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync("kundian_miniapps_basicData").share_title
    };
  }
});