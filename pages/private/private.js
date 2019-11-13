// pages/private/private.js
const request = require("../../utils/request.js");
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		datas:[
			{
				title:'装修分类',
				name:'点击选择',
				type:['家装','工装'],
				code:false
			},
			{
				title:'建筑设计',
				name:'点击选择',
				type:['别墅','公寓','住宅'],
				code:false
			},
			{
				title:'设计风格',
				name:'点击选择',
				type:['现代简约','中式怀旧','欧式古典','西式田园','中西合璧','其它'],
				code:false
			}
		],
		type:[
			['别墅','公寓','住宅'],
			['办公室','学校','医院','会所','酒店','商场','店铺','银行']
		],
		privates:{
			name:'',
			tel:'',
			data:[],
			tips:''
		}
	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		let that = this
		let data = that.data.datas
		data[1].type = that.data.type[0]
		this.setData({
			datas:that.data.datas
		})
		request.request('select_user_info','POST','').then(res => {
			console.log(res)
			that.data.privates.tel = res.data.data.tel
			this.setData({
				privates:that.data.privates
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
		// request.login()
	},
	
	getPhoneNumber:function(e){
		let that = this
		let datas = {
			errMsg:e.detail.errMsg,
			iv:e.detail.iv,
			encryptedData:e.detail.encryptedData,
			sessionKey:''
		}
		wx.getStorage({
			key:'sessionid',
			success(e){
				console.log(e)
				datas.sessionKey = e.data.sessionkey
				request.request('get_user_phone','POST',datas).then(res => {
					console.log(res)
					if(res.data.code == 1){
						that.data.privates.tel = res.data.data.tel
						that.setData({
							privates:that.data.privates
						})
					}else if(res.data.code == 2){
						wx.showToast({
							title:res.data.msg,
							icon: 'none',
							duration: 1500
						})
					}
				})
			}
		})
		
	},
	
	
	
	type:function(e){
		let id = e.currentTarget.dataset.id
		let value = e.detail.value
		let that = this
		let data = that.data.datas
		console.log(e)
		if(id == 0){
			value == 0?(data[1].type = that.data.type[0]):(data[1].type = that.data.type[1])
			console.log(data[0].name)
			console.log(data[0].type[value])
			if(data[0].name != data[0].type[value]){
				data[1].name = '点击选择'
			}
		}
		data[id].name = data[id].type[value]
		that.setData({
			datas:data
		})
	},
	remarks:function(e){
		this.data.privates.tips = e.detail.value
		this.setData({
			privates:this.data.privates
		})
	},
	oname:function(e){
		this.data.privates.name = e.detail.value
		this.setData({
			privates:this.data.privates
		})
	},
	
	conserve:function(){
		let that = this
		let privates = that.data.privates
		for(let i = 0; i < that.data.datas.length; i++){
			privates.data[i] = that.data.datas[i].name
			if(privates.data[i] == '点击选择'){
				privates.data[i] = ''
			}
		}
		console.log(privates)
		request.request('personal_tailor','POST',privates).then(res => {
			console.log(res)
			wx.showToast({
				title: res.data.msg,
				icon: 'none',
				duration: 1000
			})
			if(res.data.code == 1){
				wx.switchTab({
					url: '../index/index'
				})
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