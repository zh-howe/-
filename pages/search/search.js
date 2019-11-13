// pages/search/search.js
const request = require("../../utils/request.js");
Page({
	/**
	* 页面的初始数据
	*/
	data: {
		isdata:true,
		touch:false,
		dataSide:{
			offset:0,
			length:6,
			data:''
		},
		shopCase:[],
		keyword:'',
		shopClickData:'',//加入购物车数据
		shopState:{
			lAnimate:'',//购物车出现动画
			rAnimate:'',//购物车隐藏动画
			modelOption:false//切换购物车黑色背景
		},
		shopNumber:1//购物车所选商品的个数
	},
	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		let that = this
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.on('searchData', function(data) {
			wx.setNavigationBarTitle({
				title: data.data
			})
			that.setData({
				keyword:data.data
			})
			that.data.dataSide.data = data.data
			that.setData({
				dataSide:that.data.dataSide
			})
			let datas = that.data.dataSide
			request.request('index_search','POST',datas).then(res => {
				that.setData({
					shopCase:res.data.data
				})
				if(that.data.shopCase.length <= 0){
					that.setData({
						isdata:false
					})
				}else{
					that.setData({
						isdata:true
					})
				}
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
	hideShop:function(){
		let option = {
			duration: 200,
			timingFunction: 'linear'
		}
		let lanimation = wx.createAnimation(option)
		lanimation.translateY(0).step()
		this.setData({
			shopState:{
				modelOption: false,
				lAnimate: lanimation.export()
			}
		})
	},
	
	shopVertical:function(e){//竖着
		let oindex = e.currentTarget.dataset.id //获取当前索引 需要页面配合 wx:key="{{index}}" data-id='{{index}}'
		let oshopCase = this.data.shopCase
		this.setData({ //实时更改数据
			shopClickData:oshopCase[oindex] //将data赋值给shopClickData
		})
		this.shopClick() //调用函数shopClick并执行
	},
	shopHorizontal:function(e){//横着
		let oindex = e.currentTarget.dataset.id
		let oshopCase = this.data.shopCase
		this.setData({
			shopClickData:oshopCase[oindex]
		})
		this.shopClick()
	},
	
	shopClick:function(){
		let that = this
		let num = 1
		let option = {
			duration: 200,
			timingFunction: 'linear'
		}
		let lanimation = wx.createAnimation(option) // 创建动画
		lanimation.translateY(-221).step()// 底部弹出
		that.setData({
			shopState:{
				modelOption: true,
				lAnimate: lanimation.export()
			},
			shopNumber:num
		})
	},
	
	hideShop:function(){
		let option = {
			duration: 200,
			timingFunction: 'linear'
		}
		let lanimation = wx.createAnimation(option)
		lanimation.translateY(0).step()
		this.setData({
			shopState:{
				modelOption: false,
				lAnimate: lanimation.export()
			}
		})
	},
	
	addClick:function(){
		let num = this.data.shopNumber
		let stock = this.data.shopClickData.stock
		num ++
		if(num > stock){
			num = stock
			this.setData({
				shopNumber:num
			})
			wx.showToast({
				title: '库存容量不足',
				icon: 'none',
				duration: 1000
			})
		}else{
			this.setData({
				shopNumber:num
			})
		}
	},
	
	subClick:function(){
		let num = this.data.shopNumber
		num --
		if(num <= 0){
			num = 1
			this.setData({
				shopNumber:num
			})
			wx.showToast({
				title: '选择的商品数量至少为1',
				icon: 'none',
				duration: 1000
			})
		}else{
			this.setData({
				shopNumber:num
			})
		}
	},
	
	shopNum:function(e){
		this.data.shopNumber = e.detail.value
		let stock = this.data.shopClickData.stock
		if(e.detail.value < 0){
			this.setData({
				shopNumber:1
			})
			wx.showToast({
				title: '选择的商品数量至少为1',
				icon: 'none',
				duration: 1000
			})
		}else if(e.detail.value == 0){
			wx.showToast({
				title: '选择的商品数量至少为1',
				icon: 'none',
				duration: 1000
			})
		}else if(e.detail.value > stock){
			wx.showToast({
				title: '库存容量不足',
				icon: 'none',
				duration: 1000
			})
			e.detail.value = stock
			this.setData({
				shopNumber:e.detail.value
			})
		}else if(!/(^\d+$)/.test(e.detail.value)){
			this.setData({
				shopNumber:1
			})
			wx.showToast({
				title: '请输入正整数',
				icon: 'none',
				duration: 1000
			})
		}else{
			this.setData({
				shopNumber:e.detail.value
			})
		}
	},
	
	addToCart:function(){
		let that = this
		let odata = {
			gid:this.data.shopClickData.id,
			num:this.data.shopNumber,
			price:this.data.shopClickData.price*this.data.shopNumber
		}
		request.request('is_vip','POST',odata.gid).then(res => {
			if(res.data.isvip == 1){
				if(this.data.shopNumber<=0){
					wx.showToast({
						title: '商品数量至少为1',
						icon: 'none',
						duration: 1000
					})
				}else{
					request.request('add_shopping_cart','POST',odata).then(res => {
						that.hideShop()
						wx.showToast({
							title: '加入购物车成功',
							icon: 'none',
							duration: 2000
						})
					})
				}
			}else if(res.data.isvip == 2){
				wx.showToast({
					title: '此商品为VIP专享！',
					icon: 'none',
					duration: 2000
				})
			}
		})
	},
	
	
	/**
	* 页面上拉触底事件的处理函数
	*/
	onReachBottom: function () {
		let that = this
		that.setData({
			touch:true
		})
		let option = {
			duration: 3000,
			timingFunction: 'linear'
		}
		let lanimation = wx.createAnimation(option)
		lanimation.rotate(180*10).step()
		that.setData({
			rotate: lanimation.export()
		});
		setTimeout(function(){
			if(that.data.shopCase.length%6 !== 0){
				that.setData({
					rotate: lanimation.export(),
					touch2:true,
					touch:false
				})
			}else{
				let dataSide = that.data.dataSide
				dataSide.offset+=1
				console.log(dataSide)
				let datas = that.data.dataSide
				request.request('index_search','POST',datas).then(res => {
					that.hideShop()
					let oshopCase = that.data.shopCase
					let oshopCase2 = oshopCase.concat(res.data.data)
					that.setData({
						shopCase: oshopCase2,
						rotate: lanimation.export(),
						touch:false
					})
				})
			}
		},500)
	},

	/**
	* 用户点击右上角分享
	*/
	onShareAppMessage: function () {

	}
})