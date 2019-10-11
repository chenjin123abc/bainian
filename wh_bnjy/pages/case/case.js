import http from '../../util/request.js';
const app = getApp();
Page({
  data: {
    SystemInfo: app.globalData.sysData,
    currentCategory: "全部",
    currentNews: [],
    Keyword: "",
    Carousel: [],
    category: [],
    page: 1,
    type_id: 0,
    is_tabbar: !1,
    tabBar: [],
    currentList:[]
  },
  onLoad: function (a) {
    var id = a.projectid;
    var cate=a.cate;
    var _this=this;
    _this.currentcate(cate);  //点击之后就直接变成对应的导航，不要进入全部
    app.util.request({
      url:"entry/wxapp/getprojectall",
      "cachetime": "30",
      success(res) {

        //先把所有项目的banner图搞出来
        var data=res.data.data;
        for(var i=0;i<data.length;i++){
          var img={
            src: data[i].productimg
          };
          var title={
            type_name: data[i].name,
            id: data[i].kind
          };
          _this.setData({
            Carousel: _this.data.Carousel.concat(img),//这是项目的banner图
            category: _this.data.category.concat(title),//这是所有项目的文字类别
          });
        };
        //当banner图和那个菜单栏全部出来以后
        app.util.request({
          url: "entry/wxapp/getproductall",
          data: {
            id: id
          },
          success(res){
            var data=res.data.data;
            for(var i=0;i<data.length;i++){
              var objmidd={
                id:data[i].id,
                cover:data[i].proimg,
                title:data[i].name
              }
              _this.setData({
                currentList: _this.data.currentList.concat(objmidd)
              })
            }
          }
        })

      }
    })
  },
  currentcate:function(e){
    var _this=this;
    var cate=e;
    _this.setData({
      currentCategory:cate
    })

  },
  changeCate: function (a) {
    var _this = this;

    var id = a.currentTarget.dataset.typeid
    _this.setData({
      currentCategory: a.currentTarget.dataset.cate
    })
    app.util.request({
      url: "entry/wxapp/getproductall",
      data: {
        id: id
      },
      success(res) {
        var data = res.data.data;
        _this.setData({
          currentList: []
        })
        for (var i = 0; i < data.length; i++) {
          var objmidd = {
            id: data[i].id,
            cover: data[i].proimg,
            title: data[i].name
          }
          _this.setData({
            currentList: _this.data.currentList.concat(objmidd)
          })
        }
      }
    })
    // var t = this, e = a.currentTarget.dataset.cate, n = [];
    // "全部" === e ? n = t.data.newsList : t.data.newsList.map(function (a) {
    //   a.type == e && n.push(a);
    // });
    // var s = this, i = app.siteInfo.uniacid, r = a.currentTarget.dataset.typeid;
    // app.util.request({
    //   url: "entry/wxapp/news",
    //   data: {
    //     op: "getNewsByType",
    //     uniacid: i,
    //     type_id: r
    //   },
    //   success: function (a) {
    //     console.log(a), s.setData({
    //       currentNews: a.data.newsData
    //     });
    //   }
    // }), t.setData({
    //   currentCategory: e,
    //   type_id: r
    // });
  },
  selectProduct: function (a) {
    this.setData({
      Keyword: a.detail.value
    });
  },
  Search: function () {
    console.log("12312");
  },

  // selectTitle: function (a) {
  //   var t = a.detail.value, e = app.siteInfo.uniacid, n = this;
  //   app.util.request({
  //     url: "entry/wxapp/news",
  //     data: {
  //       op: "getNewsByType",
  //       uniacid: e,
  //       title: t
  //     },
  //     success: function (a) {
  //       console.log(a), n.setData({
  //         currentNews: a.data.newsData
  //       });
  //     }
  //   });
  // },
  intoProductDetail: function (a) {
    var id = a.currentTarget.dataset.pid;
    wx.navigateTo({
      url: "../casedetail/casedetail?pid=" + id
    });
  },
  onShareAppMessage: function (a) {
    return {
      title: wx.getStorageSync("kundian_miniapps_basicData").share_title
    };
  }
});