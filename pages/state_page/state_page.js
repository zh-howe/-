// pages/state_page/state_page.js
const request = require("../../utils/request.js");
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		mHidden:true,
		mHidden2:true,
		oid:0,
		odata:[]
	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (e) {
		let that = this
		that.setData({
			oid:e.id
		})
		console.log(e.id)
		request.request('get_order_info','POST',that.data.oid).then(res => {
			that.setData({
				odata:res.data.data
			})
			console.log(that.data.odata)
		})
	},
	revoke:function(){
		this.setData({
			mHidden:false
		})
	},
	buy2:function(){
		// 去支付
		let that = this
		request.request('prepaid_again','POST',that.data.oid).then(res => {
			let data = res.data.data
			wx.requestPayment({
				'timeStamp': data.timeStamp,
				'nonceStr': data.nonceStr,
				'package': data.package,
				'signType': 'MD5',
				'paySign': data.paySign,
				'success':function(e){
					console.log(e)
					wx.navigateBack({
					  delta: 1
					})
				},
				'fail':function(e){
					console.log(e)
				}
			})
		})
	},
	buy3:function(e){
		// 确认收货
		this.setData({
			mHidden2:false
		})
	},
	buy4:function(e){
		let that = this
		wx.navigateTo({
		  url: '../evaluate/evaluate?id=' + that.data.oid
		})
	},
	// modify:function(){
	// 	let that = this
	// 	wx.navigateTo({
	// 	  url: '../after/after?id=' + that.data.oid
	// 	})
	// },
	buy5:function(e){
		// 申请退款
		let that = this
		wx.navigateTo({
		  url: '../after/after?id=' + that.data.oid
		})
	},
	modelCancel:function(){
		this.setData({
			mHidden:true
		})
	},
	changeModel:function(){
		let that = this
		that.setData({
			mHidden:true
		})
		request.request('undo_refund','POST',that.data.oid).then(res => {
			console.log(res.data)
			wx.switchTab({
			  url: '../my/my'
			})
		})
	},
	modelCancel2:function(){
		this.setData({
			mHidden2:true
		})
	},
	changeModel2:function(){
		// 确认收货
		let that = this
		request.request('the_goods','POST',that.data.oid).then(res => {
			console.log(res.data)
			that.setData({
				mHidden2:true
			})
			// wx.redirectTo({
			//   url: '../state/state?id=4'
			// })
			wx.switchTab({
			  url: '../my/my'
			})
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