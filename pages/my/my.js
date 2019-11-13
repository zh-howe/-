// pages/my/my.js
const request = require("../../utils/request.js");
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		code:false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		data:{
			name:'',
			url:'../image/toux.png'
		},
		state:[
			{
				name:'待付款',
				src:'01.png'
			},
			{
				name:'待发货',
				src:'02.png'
			},
			{
				name:'待收货',
				src:'03.png'
			},
			{
				name:'待评价',
				src:'04.png'
			},
			{
				name:'售后服务',
				src:'05.png'
			}
		]
	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function () {
		let that = this
		request.login()
		wx.getSetting({
		  success (res){
			if (!res.authSetting['scope.userInfo']) {
				that.data.code = false
			}else{
				wx.getUserInfo({
					success: function(res) {
						that.data.data.name = res.userInfo.nickName
						that.data.data.url = res.userInfo.avatarUrl
						that.setData({
							data:that.data.data,
							code:true
						})
						request.request('save_user_info','POST',res.userInfo).then(res => {
							
						})
					}
				})
			}
		  }
		})
	},
	state:function(e){
		let id = e.currentTarget.dataset.id
		if(id == undefined){
			id = -1
		}
		wx.navigateTo({
		  url: '../state/state?id=' + (id + 1)
		})
	},
	xiugai:function(){
		wx.getSetting({
		  success (res){
			if (res.authSetting['scope.userInfo']) {
				wx.navigateTo({
				  url: '../modify/modify'
				})
			}else{
				wx.showToast({
					title: '暂未登录，无法操作',
					icon: 'none',
					duration: 1000
				})
			}
		  }
		})
	},
	openSetting:function(){
		let that = this
		wx.openSetting({
		  success (res) {
			console.log(res.authSetting)
			if(!(res.authSetting['scope.userInfo'])){
				let data = {
					name:'',
					url:'../image/toux.png'
				}
				that.setData({
					data:data,
					code:false
				})
			}else{
				wx.getUserInfo({
					success: function(res) {
						that.data.data.name = res.userInfo.nickName
						that.data.data.url = res.userInfo.avatarUrl
						that.setData({
							data:that.data.data,
							code:true
						})
						request.request('save_user_info','POST',res.userInfo).then(res => {
							
						})
					}
				})
			}
		  }
		})
	},
	bindGetUserInfo (e) {
		let that = this
		if(e.detail.userInfo){
			that.data.data.name = e.detail.userInfo.nickName
			that.data.data.url = e.detail.userInfo.avatarUrl
			that.setData({
				data:that.data.data,
				code:true
			})
			request.request('save_user_info','POST',e.detail.userInfo).then(res => {
				console.log(res)
				if(res.code == 3){
					request.login()
				}else{
					wx.showToast({
						title: '获取成功',
						icon: 'none',
						duration: 1000
					})
				}
			})
		}else{
			console.log(e)
		}
	},
	// login: function(){
	// 	let that = this
	// 	request.login()
	// 	wx.getSetting({
	// 		success(res) {
	// 			if (res.authSetting['scope.userInfo']) {
	// 				wx.getUserInfo({
	// 					success: res => {
	// 						that.data.code = true
	// 					}
	// 				})
	// 			}else{
	// 				wx.authorize({
	// 					scope: 'scope.userInfo',
	// 					success (res) {
	// 						wx.getUserInfo({
	// 							success: res => {
	// 								that.data.code = true
	// 							}
	// 						})
	// 					}
	// 				})
	// 			}
	// 		}
	// 	})
	// },
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