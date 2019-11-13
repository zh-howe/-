// pages/app.js
const request = require("utils/request.js");

App({

  // 生命周期函数--监听小程序初始化
  onLaunch:function(){

  },

  // 生命周期函数--监听小程序启动或切前台
  onShow: function () {
	request.login()
  },

  // 生命周期函数--监听小程序切后台
  onHide: function () {

  },

  // 错误监听函数

  onError: function () {

  },

  // 页面不存在监听函数
  onPageNotFound:function(){

  }


})