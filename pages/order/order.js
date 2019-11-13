// pages/order/order.js
const request = require("../../utils/request.js");
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		odata:[],//传给后台的数据 从上一个页面获取
		datas:[],//获取从后台传来的数据
		address_code:false,//是否有默认收货地址 默认为false
		address:'',//收货地址
		coupon2:'点击选择',//优惠券选择
		coupon:['不使用优惠券'],//存放优惠券的地方
		oid:0,
		couponList:[],
		couponData:{},
		couponData2:false,
		oval:'',//买家留言
		couponListid:0,
	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (option) {
		let that = this
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.on('orderData', function(data) {
			that.setData({
				odata:data.data
			})
		})
		request.request('wait_use_coupon_list','POST','').then(res => {
			// console.log(res)
			for(let i = 0; i < res.data.length; i++){
				let name = res.data[i].name
				switch(res.data[i].type){
					case 1:
						name = res.data[i].name + '（' + res.data[i].discount + '折' + '）';
						break;
					case 2:
						name = res.data[i].name + '（' + res.data[i].price + '元代金券' + '）';
						break;
					case 3:
						name = res.data[i].name + '（' + '满' + res.data[i].meet_price + '减' + res.data[i].price + '）';
						break;
				}
				that.data.coupon.push(name)
			}
			that.setData({
				couponList:res.data,
				coupon:that.data.coupon
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
		let that = this
		wx.getStorage({
		  key: 'back',
		  success (res) {
			console.log(res.data.id)
		    if(res.data.id == 1){
				wx.navigateBack({
				  delta: 1
				})
				wx.removeStorage({
				  key: 'back',
				  success (e) {
				    console.log(e)
				  }
				})
			}
		  }
		})
		request.request('settlement','POST',that.data.odata).then(res => {
			that.setData({
				datas:res.data
			})
			if(!that.data.couponData2){
				that.data.couponData2 = !that.data.couponData2
				that.data.couponData.price = that.data.datas.price
				that.data.couponData.coupon = 0
				that.data.couponData.freight_price = that.data.datas.freight_price
				that.data.couponData.actual = that.data.datas.count_price
				that.setData({
					couponData:that.data.couponData
				})
				// console.log(that.data.couponData)
			}
			if(res.data.shopaddr.status == 1){
				that.setData({
					address_code:true
				})
			}else{
				that.setData({
					address_code:false
				})
			}
			if(res.data.goods_coupon.status == 2){
				that.setData({
					coupon:['暂无']
				})
			}
		})
	},
	orderAddress:function(){
		let that = this
		wx.navigateTo({
		  url: '../address/address',
		  events: {
			acceptDataFromOpenedPage: function(data) {//状态码 判断是否从地址列表页跳转到确认订单页的
				that.data.odata[0].status = data.data
				that.setData({
					odata:that.data.odata
				})
				request.request('settlement','POST',that.data.odata).then(res => {
					
				})
			}
		  }
		})
	},
	message:function(e){
		this.setData({
			oval:e.detail.value
		})
	},
	payment:function(){
		let that = this
		let goods = {
			gid:[],
			nums:[],
			val:that.data.oval,
			addressId:'',
			o_price:that.data.couponData.price,
			couponId:this.data.couponListid,
			shoping:that.data.odata[0].shoping
		}
		for(let i = 0; i < this.data.datas.data.length; i++){
			goods.nums.push(this.data.datas.data[i].num)				
			goods.gid.push(this.data.datas.data[i].id)
		}
		console.log(goods)
		if(this.data.datas.shopaddr.data == null){
			wx.showToast({
			  title: '请选择收货地址',
			  icon: 'none',
			  duration: 2000
			})
		}else{
			goods.addressId = this.data.datas.shopaddr.data.id
			// console.log(goods)
			request.request('prepaid','POST',goods).then(res => {
				console.log(res)
				let data = res.data.data
				wx.requestPayment({
					'timeStamp': data.timeStamp,
					'nonceStr': data.nonceStr,
					'package': data.package,
					'signType': 'MD5',
					'paySign': data.paySign,
					'success':function(e){
						wx.setStorage({
							key:"back",
							data:{
								id:1
							}
						})
						wx.navigateTo({
						  url: '../state/state?id=2'
						})
					},
					'fail':function(e){
						console.log(e)
						wx.setStorage({
							key:"back",
							data:{
								id:1
							}
						})
						wx.navigateTo({
						  url: '../state/state?id=1'
						})
					}
				})
			})
		}
		
	},
	// birthday:function(e){
	// 	let val = e.detail.value
	// 	this.setData({
	// 		value:val
	// 	})
	// },
	
	type:function(e){
		let val = e.detail.value
		let that = this
		if(val > 0){
			val--
			let datas = {
				id:that.data.couponList[val].id,
				price:that.data.datas.count_price
			}
			request.request('get_coupon_price','POST',datas).then(res => {
				that.setData({
					couponData:res.data.data,
					couponListid:datas.id
				})
			})
			val ++
		}else if(val == 0){
			that.data.couponData.price = that.data.datas.count_price
			that.data.couponData.coupon = 0
			that.data.couponData.actual = (that.data.datas.count_price - that.data.couponData.coupon)
			that.setData({
				couponData:that.data.couponData
			})
			
		}
		that.setData({
			coupon2:that.data.coupon[val]
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