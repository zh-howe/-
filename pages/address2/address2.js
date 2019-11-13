// pages/address2/address2.js
const request = require("../../utils/request.js");
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		value:'',
		checked:'已选中',
		default:2,
		odata:{},
		code:0
	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		let that = this
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.on('acceptDataFromOpenerPage', function(data) {
			console.log(data.data)
			request.request("get_shopaddr_info",'POST',data.data).then(res => {
				that.setData({
					code:1
				})
				wx.setNavigationBarTitle({
					title: '修改收货地址'
				})
				console.log(res)
				that.data.value = res.data.data.address
				that.setData({
					odata:res.data.data,
					value:that.data.value
				})
			})
		})
	},

	bindRegionChange: function (e) {
		let that = this
		let val = e.detail.value
		let data = val[0] + '-' + val[1] + '-' + val[2]
		that.setData({
			value:data
		})
	},
	checkboxChange:function(e){
		console.log(e)
		if(e.detail.value.length != 0){
			this.setData({
				default:1
			})
		}else{
			this.setData({
				default:2
			})
		}
	},
	formSubmit:function(e){
		e.detail.value.default = this.data.default
		e.detail.value.id = this.data.odata.id
		console.log(e.detail.value)
		let adddata = this.data.code == 0?'save_shopaddr':'update_shopaddr_info'
		request.request(adddata,'POST',e.detail.value).then(res =>{
			console.log(res)
			if(res.data.code == 1){
				wx.navigateBack({
					delta: 1
				})
			}else{
				wx.showToast({
					title: res.data.msg,
					icon: 'none',
					duration: 1000
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