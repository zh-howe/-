// pages/commentary/commentary.js
const request = require("../../utils/request.js");
Page({
	/**
	* 页面的初始数据
	*/
	data: {
		pageData:{},
		oindex:[],
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
		odata:{
			id:0,
			page:0,
			length:10
		}
	},
	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (e) {
		let that = this
		that.data.odata.id = e.id
		that.setData({
			odata:that.data.odata
		})
		request.request('get_goods_comments','POST',that.data.odata).then(res => {
			console.log(res.data.data)
			for(let i = 0; i < res.data.data.length; i++){
				that.data.oindex[i] = res.data.data[i].num
			}
			that.setData({
				pageData:res.data,
				oindex:that.data.oindex
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
		let that = this
		request.request('get_goods_comments','POST',that.data.odata).then(res => {
			if(res.data.data.length>that.data.pageData.length){
				that.data.odata.page ++
				request.request('get_goods_comments','POST',that.data.odata).then(e => {
					for(let i = 0; i < e.data.data.length; i++){
						that.data.oindex[i] = e.data.data[i].num
					}
					that.setData({
						pageData:e.data,
						oindex:that.data.oindex
					})
				})
			}else{
				wx.showToast({
				  title: '已到底部',
				  icon: 'none',
				  duration: 2000
				})
				for(let i = 0; i < res.data.data.length; i++){
					that.data.oindex[i] = res.data.data[i].num
				}
				that.setData({
					pageData:res.data,
					oindex:that.data.oindex
				})
			}
		})
	},

	/**
	* 用户点击右上角分享
	*/
	onShareAppMessage: function () {

	}
})