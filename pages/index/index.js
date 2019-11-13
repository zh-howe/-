// pages/index/index.js
const request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
	data: {
		//banner data
		banner:[],
		//banner的索引
		banner_index:1,
			//每日热讯
		news: [
			{
				id: 0,
				content: '点击开通会员，福利多多，优惠多多。'
			},
			{
				id: 1,
				content: '第一届北京朝阳灯饰节将在古塔公园举行！'
			}
		],
		//模块公共头部
		shopview:[
			{
				name:'限时抢购',
				href:''
			}
		],
		shopCase:[],
		
		shopClickData:'',//加入购物车数据
		shopState:{
			lAnimate:'',//购物车出现动画
			rAnimate:'',//购物车隐藏动画
			modelOption:false//切换购物车黑色背景
		},
		shopNumber:1,//购物车所选商品的个数
	},
		
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		request.login()
		let that = this
		request.request('get_index_banner','POST','').then(res => {
		  that.setData({
		  	banner:res.data
		  })
		})
		request.request('get_index_goods','POST','').then(res => {
		  that.data.shopCase[0] = res.data.limited
		  that.data.shopCase[1] = res.data.member
		  that.data.shopCase[2] = res.data.wonderful
		  that.setData({
		  	shopCase:that.data.shopCase
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
		request.login()
	},
	
	// bindGetUserInfo (e) {
	// 	console.log(e.detail.userInfo)
	// },
	bannerSilde:function(e){
		//监听banner 索引的变化 并赋值给banner.index
		this.setData({
		  banner_index: e.detail.current + 1
		})
	},
	listVip:function(){
		wx.reLaunch({
			url: '../commodity/commodity?id=4'
		})
	},
	listTuijian:function(){
		wx.reLaunch({
			url: '../commodity/commodity?id=1'
		})
	},
	listXianshi:function(){
		wx.reLaunch({
			url: '../commodity/commodity?id=5'
		})
	},
	searchOver:function(e){
		wx.navigateTo({
			url: '../search/search',
			success: function(res) {
				res.eventChannel.emit('searchData', { data: e.detail.value})
			}
		})
	},

	//点击收藏到购物车时 执行的函数--go
	
	
	//1、将所点击的商品数据渲染到底部购物车栏里
	shopVertical:function(e){//竖着
		let oindex = e.currentTarget.dataset.id //获取当前索引 需要页面配合 wx:key="{{index}}" data-id='{{index}}'
		let oshopCase = this.data.shopCase[1]
		this.setData({ //实时更改数据
			shopClickData:oshopCase[oindex] //将data赋值给shopClickData
		})
		this.shopClick() //调用函数shopClick并执行
	},
	shopHorizontal:function(e){//横着
		let oindex = e.currentTarget.dataset.id
		let oshopCase = this.data.shopCase[2]
		this.setData({
			shopClickData:oshopCase[oindex]
		})
		this.shopClick()
	},
	//将所点击的商品数据渲染到底部购物车栏里 end
	
	//2、点击购物车小图标后 执行显示底部加入购物车栏的动画
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
	//点击购物车小图标后 执行显示底部加入购物车栏的动画 end
	
	//3、点击灰色背景后 执行隐藏底部加入购物车栏的动画
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
	//点击灰色背景后 执行隐藏底部加入购物车栏的动画 end
	
	//4、点击加号 增加商品数量
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
	//点击加号 增加商品数量 end
	
	//5、点击减号 减少商品数量
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
	//点击减号 减少商品数量 end
	
	//6、输入添加购物车里商品的数量
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
	//输入添加购物车里商品的数量 end
	
	//7、点击加入购物车
	addToCart:function(){
		let that = this
		let odata = {
			gid:this.data.shopClickData.id,
			num:this.data.shopNumber,
			price:this.data.shopClickData.price*this.data.shopNumber
		}
		request.request('is_vip','POST',odata.gid).then(res => {
			console.log(res)
			if(res.data.isvip == 1){
				if(this.data.shopNumber<=0){
					wx.showToast({
						title: '商品数量至少为1',
						icon: 'none',
						duration: 1000
					})
				}else{
					this.hideShop()
					request.request('add_shopping_cart','POST',odata).then(res => {
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
	//点击加入购物车 end
	
	
	//点击收藏到购物车时 执行的函数 end
	
	
	
	
	

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