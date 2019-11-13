// pages/coupon/coupon.js
const request = require("../../utils/request.js");
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		code:false,//是否显示 暂无
		left:0,//下划线位置
		id:0,//控制字体颜色
		state:['全部','待支付','待发货','待收货','待评价','售后服务'],
		length:{
			id:'',
			page:0,
			length:5,
		},
		odata:[],
		mHidden:true,
		mHidden2:true,
		mHidden3:true,
		onbottom:true,
		quid:0,
		delid:0,
		oid:0
	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		let that = this
		that.data.length.id = options.id*1+1
		that.setData({
			left:(140*(options.id)),
			id:options.id,
			length:that.data.length
		})
		if(that.data.odata.length <= 0){
			that.setData({
				code:true
			})
		}else{
			that.setData({
				code:false
			})
		}
		wx.setNavigationBarTitle({
			title: that.data.state[options.id]
		})
		request.request('for_the_payment','POST',that.data.length).then(res => {
			console.log(res)
			for(let i = 0; i < res.data.data.length; i++){
				that.data.odata[i] = res.data.data[i]
			}
			that.setData({
				odata:that.data.odata
			})
		})
	},
	
	/**
	* 生命周期函数--监听页面显示
	*/
	onShow: function () {
		// let that = this
		// request.request('for_the_payment','POST',that.data.length).then(res => {
		// 	for(let i = 0; i < res.data.data.length; i++){
		// 		that.data.odata[i] = res.data.data[i]
		// 	}
		// 	that.setData({
		// 		odata:that.data.odata
		// 	})
		// })
	},
	stateState:function(e){
		let that = this
		// that.data.odata.name = that.data.state[e.currentTarget.dataset.id]
		that.data.length.id = e.currentTarget.dataset.id*1+1
		that.data.length.page = 0
		that.setData({
			odata:[],
			onbottom:true,
			length:that.data.length
		})
		request.request('for_the_payment','POST',that.data.length).then(res => {
			if(res.data.data.length <= 0){
				that.data.odata = []
				that.data.code = false
			}else{
				that.data.code = true
				for(let i = 0; i < res.data.data.length; i++){
					that.data.odata[i] = res.data.data[i]
				}
			}
			that.setData({
				odata:that.data.odata,
				code:that.data.code
			})
		})
		that.setData({
			left:(140*(e.currentTarget.dataset.id)),
			id:e.currentTarget.dataset.id,
		})
		wx.setNavigationBarTitle({
			title: that.data.state[e.currentTarget.dataset.id]
		})
	},
	buy:function(e){
		// 取消订单
		this.setData({
			mHidden:false,
			quid:e.target.dataset.id
		})
	},
	buy2:function(e){
		// 去支付
		let that = this
		let oid = that.data.odata[e.target.dataset.id].id
		request.request('prepaid_again','POST',oid).then(res => {
			let data = res.data.data
			wx.requestPayment({
				'timeStamp': data.timeStamp,
				'nonceStr': data.nonceStr,
				'package': data.package,
				'signType': 'MD5',
				'paySign': data.paySign,
				'success':function(e){
					wx.navigateTo({
					  url: '../state/state?id=2'
					})
				},
				'fail':function(e){
					
				}
			})
		})
	},
	buy3:function(e){
		// 确认收货
		this.setData({
			mHidden3:false,
			oid:e.target.dataset.id
		})
	},
	modelCancel3:function(){
		this.setData({
			mHidden3:true
		})
	},
	changeModel3:function(){
		// 确认收货
		let that = this
		let oid = that.data.odata[that.data.oid].id
		request.request('the_goods','POST',oid).then(res => {
			that.setData({
				mHidden3:true
			})
			wx.switchTab({
			  url: '../my/my'
			})
		})
	},
	buy4:function(e){
		// 去评价
		let that = this
		let oid = that.data.odata[e.target.dataset.id].id
		wx.navigateTo({
		  url: '../evaluate/evaluate?id=' + oid
		})
	},
	buy5:function(e){
		// 申请退款
		let that = this
		let oid = that.data.odata[e.target.dataset.id].id
		wx.navigateTo({
		  url: '../after/after?id=' + oid
		})
	},
	buy6:function(e){
		// 删除订单
		let that = this
		this.setData({
			mHidden2:false,
			delid:e.target.dataset.id
		})
	},
	modelCancel:function(){
		// 取消订单 取消
		this.setData({
			mHidden:true
		})
	},
	changeModel:function(e){
		// 取消订单 确认
		let that = this
		let oid = that.data.odata[that.data.quid].id
		request.request('cancel_order','POST',oid).then(res => {
			that.data.odata.splice(that.data.quid, 1)
			that.setData({
				odata:that.data.odata
			})
			that.setData({
				mHidden:true
			})
			wx.showToast({
			  title: '已取消',
			  icon: 'none',
			  duration: 1500
			})
		})
	},
	modelCancel2:function(){
		// 删除订单 取消
		this.setData({
			mHidden2:true
		})
	},
	changeModel2:function(){
		// 删除订单 确认
		let that = this
		let oid = that.data.odata[that.data.delid].id
		request.request('del_order','POST',oid).then(res => {
			that.data.odata.splice(that.data.delid, 1)
			that.setData({
				odata:that.data.odata
			})
			that.setData({
				mHidden2:true
			})
			wx.showToast({
			  title: '已删除',
			  icon: 'none',
			  duration: 1500
			})
		})
	},
	/**
	* 生命周期函数--监听页面初次渲染完成
	*/
	onReady: function () {

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
		let that = this
		if(that.data.onbottom){
			that.data.length.page++
			that.setData({
				length:that.data.length
			})
			request.request('for_the_payment','POST',that.data.length).then(res => {
				if(res.data.data.length<=0){
					that.setData({
						onbottom:false
					})
					wx.showToast({
					  title: '已到底部',
					  icon: 'none',
					  duration: 1500
					})
				}else{
					for(let i = 0; i < res.data.data.length; i++){
						that.data.odata.push(res.data.data[i])
					}
					that.setData({
						odata:that.data.odata
					})
				}
			})
		}else{
			wx.showToast({
			  title: '已到底部',
			  icon: 'none',
			  duration: 1500
			})
		}
		
	},

	/**
	* 用户点击右上角分享
	*/
	onShareAppMessage: function () {

	}
})