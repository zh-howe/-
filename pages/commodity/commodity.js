// pages/my/my.js
const request = require("../../utils/request.js");
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		state:true,//列表样式切换
		isdata:false,//数据是否为空
		imgcode:true,//图片升降序
		imgcode2:false,//图片显示隐藏
		stateSrc:['../image/icon/commodity01.png','../image/icon/commodity02.png'],//列表图片
		itemize:false,//列表模态框
		lAnimate:'',//列表淡入淡出动画名
		rotate:'',//触底动画名
		touch:false,//控制底部旋转显示与隐藏
		touch2:false,//控制底部文字显示与隐藏
		active:0,//左侧列表点击
		activeNav:0,//头部分类筛选
		code:0,//横竖商品
		dataSide:{
			offset:0,
			length:6,
			listStyle:1,
			typeStyle:"",
			order:'desc' //asc
		},
		listData:[],
		shopCase:[],
		listStyle:['综合','销量','价格','会员','限时']
	},
	/**
	* 生命周期函数--监听页面加载
	*/
   
	onLoad: function (options) {
		let that = this
		let listData = that.data.listData
		let dataSide = that.data.dataSide
		if(options.id){
			that.data.dataSide.listStyle = options.id
			that.setData({
				dataSide: that.data.dataSide,
				activeNav:(options.id - 1)
			})
		}
		request.request('classification','POST').then(res => {
		  that.setData({
		  	listData: res.data
		  })
		})
		request.request('goods','POST',dataSide).then(res => {
			this.hideShop()
			that.setData({
				shopCase: res.data
			})
			
			if(that.data.shopCase.length <= 0){
				that.setData({
					isdata: false
				})
			}else{
				that.setData({
					isdata: true
				})
			}
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
	navSort:function(e){
		let that = this
		let oindex = e.currentTarget.dataset.id
		let dataSide = this.data.dataSide
		if(oindex == 2){
			that.data.imgcode = !that.data.imgcode
			that.data.imgcode?(dataSide.order = 'desc'):(dataSide.order = 'asc')
			that.setData({
				imgcode2:true,
				imgcode: that.data.imgcode,
				order: dataSide.order
			})
		}else{
			that.setData({
				imgcode2:false
			})
		}
		dataSide.offset = 0
		dataSide.listStyle = oindex + 1
		
		request.request('goods','POST',dataSide).then(res => {
			console.log(res)
			this.hideShop()
			that.setData({
				shopCase: res.data
			})
			if(that.data.shopCase.length <= 0){
				that.setData({
					isdata: false
				})
			}else{
				that.setData({
					isdata: true
				})
			}
		})
		
		this.setData({
			activeNav:oindex
		})
	},
	
	//1、将所点击的商品数据渲染到底部购物车栏里
	shopVertical:function(e){//竖着
		let oindex = e.currentTarget.dataset.id //获取当前索引 需要页面配合 wx:key="{{index}}" data-id='{{index}}'
		console.log(this.data.shopCase[oindex])
		this.setData({
			shopClickData:this.data.shopCase[oindex] //将data赋值给shopClickData
		})
		this.shopClick()
	},
	shopHorizontal:function(e){//横着
		let oindex = e.currentTarget.dataset.id
		this.setData({
			shopClickData:this.data.shopCase[oindex]
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
	//点击加入购物车 end
	
	
	//点击收藏到购物车时 执行的函数 end
	commodityItemize:function(){
		let that = this
		let option = {
			duration: 300,
			timingFunction: 'linear'
		}
		let lanimation = wx.createAnimation(option) // 创建动画
		lanimation.translateX(125).step()// 左侧弹出
		that.setData({
			itemize:!(this.data.itemize),
			lAnimate: lanimation.export()
		});
	},
	commodityListState:function(){
		let that = this
		that.setData({
			state:!(that.data.state)
		})
	},
	commodityTopLevel:function(){
		let that = this
		let option = {
			duration: 300,
			timingFunction: 'linear'
		}
		let lanimation = wx.createAnimation(option) // 创建动画
		lanimation.translateX(0).step()// 左侧弹出
		that.setData({
			lAnimate: lanimation.export(),
			itemize:!(this.data.itemize)
		})
	},
	allcommodity:function(){
		let that = this
		this.data.dataSide.typeStyle = ''
		this.setData({
			dataSide:this.data.dataSide
		})
		
		request.request('goods','POST',this.data.dataSide).then(res => {
			this.hideShop()
			that.setData({
				shopCase: res.data
			})
			that.commodityTopLevel()
			if(that.data.shopCase.length <= 0){
				that.setData({
					isdata: false
				})
			}else{
				that.setData({
					isdata: true
				})
			}
		})
		this.setData({
			active:0
		})
	},
	commodityActive:function(e){
		let that = this
		let oid = e.currentTarget.dataset.id
		this.data.dataSide.typeStyle = oid
		this.setData({
			dataSide:this.data.dataSide
		})
		
		request.request('goods','POST',this.data.dataSide).then(res => {
			this.hideShop()
			that.setData({
				shopCase: res.data
			})
			that.commodityTopLevel()
			if(that.data.shopCase.length <= 0){
				that.setData({
					isdata: false
				})
			}else{
				that.setData({
					isdata: true
				})
			}
		})
		this.setData({
			active:oid
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
			request.request('goods','POST',dataSide).then(res => {
				that.hideShop()
				let oshopCase = that.data.shopCase
				let oshopCase2 = oshopCase.concat(res.data)
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