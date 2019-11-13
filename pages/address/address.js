// pages/address/address.js
const request = require("../../utils/request.js");
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		datas:[],
		oid:0,
		img:true
	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		let that = this
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.emit('acceptDataFromOpenedPage', {data: 2});//状态码 判断是否从地址列表页跳转到确认订单页的
		
		wx.getStorage({
			key: 'oid',
			success (e) {
				that.setData({
					oid:e.data
				})
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
		let that = this
		request.request("select_shopaddr_list",'POST','').then(res => {
			that.setData({
				datas:res.data
			})
			if(that.data.datas.length <= 0){
				that.setData({
					img:true
				})
				// wx.navigateTo({
				// 	url: '../address2/address2'
				// })
			}else{
				that.setData({
					img:false
				})
			}
			console.log(that.data.datas)
			let dataId = that.data.datas[that.data.oid].id
			let oid2 = {
				id:dataId
			}
			request.request("update_shopaddr_use",'POST',oid2).then(res => {
				
			})
		})
	},
	oaddress:function(e){
		let that = this
		let oid = e.currentTarget.dataset.id
		let oid2 = {
			id:that.data.datas[oid].id
		} 
		console.log(e.currentTarget.dataset.id)
		wx.setStorage({
			key:"oid",
			data:e.currentTarget.dataset.id
		})
		that.setData({
			oid:oid
		})
		request.request("update_shopaddr_use",'POST',oid2).then(res => {
			wx.navigateBack({
				delta: 1
			})
		})
	},
	delAddress:function(e){
		let that = this
		wx.showModal({
			title: '提示',
			content: '确认删除此条收货地址吗？',
			success (res) {
				if (res.confirm) {
					let data = that.data.datas
					let datas = {
						id:data[e.currentTarget.dataset.id].id
					}
					request.request("del_shopaddr",'POST',datas).then(res => {
						wx.showToast({
							title: '删除成功！',
							icon: 'success',
							duration: 1000
						})
						that.onShow()
					})
				}else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},
	modifyAddress:function(e){
		let that = this
		
		let oid = that.data.datas[e.currentTarget.dataset.id].id
		wx.navigateTo({
			url: '../address2/address2',
			success:function(res) {
				res.eventChannel.emit('acceptDataFromOpenerPage',{data: oid})
			}
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