// pages/modify/modify.js
const request = require("../../utils/request.js");
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1945; i <= date.getFullYear(); i++) {
	years.push(i)
}
for (let i = 1 ; i <= 12; i++) {
	if(i<10){
		months.push('0' + i)
	}else{
		months.push(i)
	}
}
for (let i = 1 ; i <= 31; i++) {
	if(i<10){
		days.push('0' + i)
	}else{
		days.push(i)
	}
}

Page({

	/**
	* 页面的初始数据
	*/
	data: {
		years:years,
		yearsData:null,
		months:months,
		days:days,
		ueserName:'',
		value:[55, 5, 5],
		code:false,
		date:null,
		phone:null,
		name:null
	},
	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function () {
		request.request('select_user_info','POST','').then(res => {
			this.setData({
				phone:res.data.data.tel,
				name:res.data.data.name,
				yearsData:res.data.data.birthday
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
	ueserName:function(e){
		let val = e.detail.value
		this.setData({
			name:val
		})
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
				datas.sessionKey = e.data.sessionkey
				request.request('get_user_phone','POST',datas).then(res => {
					console.log(res)
					if(res.data.code == 1){
						that.setData({
							phone:res.data.data.tel
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
	birthday:function(e){
		const val = e.detail.value
		this.data.date = val
	},
	choice:function(){
		this.setData({
			value:this.data.date,
			code:!(this.data.code)
		})
	},
	quxiao:function(){
		this.setData({
			code:!(this.data.code)
		})
	},
	queren:function(){
		this.setData({
			yearsData:null
		})
		if(this.data.date == null){
			this.setData({
				date:this.data.value,
				code:!(this.data.code)
			})
		}else{
			this.setData({
				date:this.data.date,
				code:!(this.data.code)
			})
		}
	},
	
	conserve:function(){
		let that = this
		let odate = that.data.date
		let odata = {
			birthday:[],
			name:that.data.name,
			tel:that.data.phone
		}
		if(odate == null){
			if(that.data.yearsData != null){
				odata.birthday = that.data.yearsData
			}else{
				odata.birthday = null
			}
		}else{
			odata.birthday = years[odate[0]] + '-'  + months[odate[1]] + '-'  + days[odate[2]]
		}
		request.request('save_user_info','POST',odata).then(res => {
			wx.showToast({
				title: '保存成功',
				icon: 'none',
				duration: 1000
			})
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