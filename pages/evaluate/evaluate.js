// pages/evaluate/evaluate.js
const request = require("../../utils/request.js");
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		starMap:[
			{
				id:0,
				name:'非常不满意'
			},
			{
				id:1,
				name:'不满意'
			},
			{
				id:2,
				name:'一般'
			},
			{
				id:3,
				name:'满意'
			},
			{
				id:4,
				name:'非常满意'
			}
		],
		oindex:[],
		odata:[],
		mHidden:true,
		val:''
	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (e) {
		let that = this
		request.request('goods_info','POST',e.id).then(res => {
			for(let i = 0; i < res.data.data.chil.length; i++){
				that.data.oindex[i] = 4 
			}
			that.setData({
				oindex:that.data.oindex,
				odata:res.data.data
			})
		})
	},
	oimg:function(e){
		let that = this
		let id = e.target.dataset.id2
		console.log(e)
		that.data.oindex[e.target.dataset.id] = id
		this.setData({
			oindex:that.data.oindex
		})
	},
	bindFormSubmit: function(e) {
		this.setData({
			mHidden:false,
			val:e.detail.value.textarea
		})
	},
	modelCancel:function(){
		this.setData({
			mHidden:true
		})
	},
	changeModel:function(){
		let that = this
		let data = {
			datas:[],
			id:that.data.odata.id
		}
		for(let i = 0; i < that.data.odata.chil.length; i++){
			data.datas[i] = {
				num:that.data.oindex[i] + 1,
				text:that.data.val,
				id:that.data.odata.chil[i].id
			}
		}
		wx.showLoading({
			title: '提交中'
		})
		request.request('evaluation','POST',data).then(res => {
			wx.hideLoading()
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