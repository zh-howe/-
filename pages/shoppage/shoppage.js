// pages/shoppage/shoppage.js
const request = require("../../utils/request.js");
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		banner_index:1,
		pageData:{},//页面展示的数据
		commentary:{},//页面评论的数据
		shopClickData:'',//加入购物车数据
		shopState:{
			lAnimate:'',//购物车出现动画
			rAnimate:'',//购物车隐藏动画
			modelOption:false//切换购物车黑色背景
		},
		shopNumber:1,//购物车所选商品的个数
		wumai:0,//判断为加入购物车还是立即购买
		tabOther:['产品详情','买家须知','买家评论'],
		otherid:0,//判断tabother的显示与隐藏
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
		is_vip:1
	},
	
	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (events) {
		let that = this
		let oid = {
			id:events.key
		}
		wx.removeStorage({
		  key: 'back',
		  success (e) {
		    // console.log(e)
		  }
		})
		wx.showLoading({
			title: '正在加载...',
		})
		request.request('detail','POST',oid).then(res => {
			let odata = {
				id:res.data.id,
				length:3,
				page:0
			}
			request.request('get_goods_comments','POST',odata).then(e => {
				for(let i = 0; i < e.data.data.length; i++){
					that.data.oindex[i] = e.data.data[i].num
				}
				that.setData({
					commentary:e.data.data,
					oindex:that.data.oindex
				})
			})
			that.setData({
				pageData:res.data,
				shopClickData:res.data,
				is_vip:res.data.is_vip
			})
			wx.setNavigationBarTitle({
				title: res.data.name
			})
			wx.hideLoading()
		})
	},
	shopSilde:function(e){
		//监听banner 索引的变化 并赋值给banner.index
		this.setData({
		  banner_index: e.detail.current + 1
		})
	},
	shopJoin:function(){
		this.shopClick()
		this.data.wumai = 0
	},
	buyNow:function(){
		this.shopClick()
		this.data.wumai = 1
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
		let stock = this.data.pageData.stock
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
		let stock = this.data.pageData.stock
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
		if(that.data.shopNumber<=0){
			wx.showToast({
				title: '商品数量至少为1',
				icon: 'none',
				duration: 1000
			})
		}else{
			that.hideShop()
			if(that.data.wumai == 0 && that.data.is_vip == 1){
				let odata = {
					gid:that.data.shopClickData.id,
					num:that.data.shopNumber,
					price:that.data.shopClickData.price*that.data.shopNumber
				}
				request.request('add_shopping_cart','POST',odata).then(res => {
					console.log(res)
					if(res.data.code == 3){
						request.login()
					}else{
						that.hideShop()
						wx.showToast({
							title: '加入购物车成功',
							icon: 'none',
							duration: 2000
						})
					}
				})
			}else if(that.data.wumai == 1 && that.data.is_vip == 1){
				let that = this
				console.log(that.data.shopClickData)
				let datas = [{
					id:that.data.shopClickData.id,
					price:that.data.shopClickData.oprice,
					num:that.data.shopNumber,
					status:1,
					shoping:1
				}]
				console.log(datas)
				wx.navigateTo({
					url: '../order/order',
					success: function(res) {
						res.eventChannel.emit('orderData', { data: datas})
					}
				})
				// wx.showToast({
				// 	title: '购买功能暂缓开通',
				// 	icon: 'none',
				// 	duration: 2000
				// })
			}else if(that.data.is_vip == 2){
				wx.showToast({
					title: '此商品为VIP专享！',
					icon: 'none',
					duration: 2000
				})
			}
		}
	},
	//点击加入购物车 end
	
	
	//点击收藏到购物车时 执行的函数 end

	tabOther:function(e){
		let index = e.currentTarget.dataset.id
		this.setData({
			otherid:index
		})
	},
	tiaozShop:function(){
		wx.switchTab({
			url: '../shopping/shopping'
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