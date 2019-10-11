// page/mai/mai.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zxkind: "",
    name: '我的预约',
    price: '10',
    zongji: '',
    cteatetime:"",
    orderid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    app.util.request({
      url:"entry/wxapp/getappointment",
      data:{
        phone:wx.getStorageSync("phone")
      },
      success(res){
        _this.setData({
          price: res.data.data.price,
          cteatetime: res.data.data.create_time, 
          zxkind: res.data.data.proname,
          orderid: res.data.data.orderid
        })
      }
    })
  },
  tuikuan:function(e){
    var orderid=e.currentTarget.dataset.oder
    var fee = e.currentTarget.dataset.fee
    app.util.request({
      url:"entry/wxapp/tuikuan",
      data:{
        orderid: orderid
      },
      success(res){
        console.log(res)
      }
    })
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

  }
})