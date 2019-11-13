// pages/coupon/coupon.js
const request = require("../../utils/request.js");
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		code:true,
		left:0,
		state:['待领取','待使用','已使用','已过期'],
		odata:[],
		oid:0
	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		
		// if(this.data.coupons.length <= 0){
		// 	this.setData({
		// 		code:false
		// 	})
		// }else{
		// 	this.setData({
		// 		code:true
		// 	})
		// }
	},

	/**
	* 生命周期函数--监听页面初次渲染完成
	*/
	onReady: function () {

	},

	/**
	* 生命周期函数--监听页面显示
	*/
	onShow: function (e) {
		let that = this
		request.request('wait_receive_coupon_list','POST','').then(res => {
		console.log(res.data)
			that.setData({
				odata:res.data
			})
		})
	},
	
	couponState:function(e){
		let that = this
		let oid = e.currentTarget.dataset.id
		let url = ''
		that.setData({
			left:(750/4*oid)
		})
		switch(oid){
			case 0:
				url = 'wait_receive_coupon_list';
				break;
			case 1:
				url = 'wait_use_coupon_list';
				break;
			case 2:
				url = 'already_use_coupon_list';
				break;
			case 3:
				url = 'already_overdue_coupon_list';
				break;
		}
		request.request(url,'POST','').then(res => {
			console.log(res)
			that.setData({
				odata:res.data,
				oid:oid
			})
		})
	},
	receive:function(e){
		let that = this
		let oid = that.data.odata[e.currentTarget.dataset.id].id
		request.request('user_add_coupon','POST',oid).then(res => {
			console.log(res)
			let odata = res.data
			if(odata.code == 1){
				that.onShow(odata)
			}else if(odata.code == 3){
				wx.showToast({
					title: odata.msg,
					icon: 'none',
					duration: 1000
				})
			}
		})
	},
	receive2:function(e){
		wx.switchTab({
			url: '../commodity/commodity'
		})
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