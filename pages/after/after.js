// pages/after/after.js
const request = require("../../utils/request.js");
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		radio:[],
		odata:{
			id:0,
			type:1,
			imgArr:[],
			remark:''
		},
		mHidden:true
	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (e) {
		var that = this;
		that.data.odata.id = e.id
		that.setData({
			odata:that.data.odata
		})
		request.request('refund_type','POST','').then(res => {
			console.log(res.data)
			that.setData({
				radio:res.data.data
			})
		})
	},
	binRadio:function(e){
		var that = this;
		that.data.odata.type = e.detail.value
		that.setData({
			odata:that.data.odata
		})
	},
	uploadPhoto() {
		var that = this;
		wx.chooseImage({
			count: 4,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: function (res) {
				var tempFilePaths = res.tempFilePaths
				for(let i = 0; i < tempFilePaths.length; i ++){
					wx.uploadFile({
						url: 'https://shop.maohemao.com/mgr/index/upload_img',
						filePath: tempFilePaths[i],
						name: 'file',
						formData:{
							'user':'test'
						},
						success:function(res){
							that.data.odata.imgArr.push(res.data)
							that.setData({
								odata:that.data.odata
							})
						}
					})
				}
			}
		})
	},
	delImg(e){
		let that = this
		that.data.odata.imgArr.splice(e.target.dataset.id,1)
		that.setData({
			odata:that.data.odata
		})
	},
	textArea(e){
		let that = this
		that.data.odata.remark = e.detail.value
		that.setData({
			odata:that.data.odata
		})
	},
	afterBtn(){
		let that = this
		this.setData({
			mHidden:false
		})
	},
	modelCancel:function(){
		this.setData({
			mHidden:true
		})
	},
	changeModel:function(){
		let that = this
		this.setData({
			mHidden:true
		})
		if(that.data.odata.remark != ''){
			request.request('refund','POST',that.data.odata).then(res => {
				console.log(res)
				wx.switchTab({
				  url: '../my/my'
				})
			})
		}else{
			wx.showToast({
			  title: '请输入详细说明',
			  icon: 'none',
			  duration: 1500
			})
		}
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