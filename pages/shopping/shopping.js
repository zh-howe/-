// pages/shoping/shoping.js
const request = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
	data: {
		showHide:false,//购物车是否为空
		checked:false,//是否全选
		edit:false,//点击编辑 结算or删除
		num:0,//商品价格
		active:'',//控制class
		odata:[],//选中商品的id
		shopping: [],//购物车中的商品
		recommend:[],//购物车为空时 加载的推荐商品
		list:[],
	},
	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function () {
		request.login()
		wx.removeStorage({
		  key: 'back',
		  success (e) {
		    console.log(e)
		  }
		})
		let that = this
		request.request('select_shopping_cart','POST').then(res => {
			that.setData({
				shopping: res.data.data
			})
			if(that.data.shopping.length > 0){
				that.setData({
					showHide:true
				})
			}else{
				that.setData({
					showHide:false
				})
			}
			console.log(res)
		})
		request.request('get_index_goods','POST').then(res => {
			that.setData({
				recommend:res.data.wonderful
			})
		})
		that.setData({
			checked:false,
			num:0
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
		wx.removeStorage({
			key: 'oid'
		})
		let that = this
		request.request('select_shopping_cart','POST').then(res => {
			that.setData({
				shopping: res.data.data
			})
			if(that.data.shopping.length > 0){
				that.setData({
					showHide:true
				})
			}else{
				that.setData({
					showHide:false
				})
			}
		})
		that.setData({
			checked:false,
			num:0
		})
	},
	edit:function(){
		let that = this
		let active = !(that.data.edit)?'active':''
		that.setData({
			edit:!(that.data.edit),
			active:active
		})
	},
	quanxuan:function(){
		let that = this
		let num = that.data.num
		that.setData({
			checked:!that.data.checked
		})
		num = 0
		for(let i = 0; i < that.data.shopping.length; i++){
			that.data.shopping[i].checked = that.data.checked
			if(that.data.checked){
				num = num + (that.data.shopping[i].price*that.data.shopping[i].shopNumber*1)
				num =  Math.floor(num*100)/100
			}else{
				num = 0
			}
			that.setData({
				shopping:that.data.shopping,
				num:num
			})
		}
	},
	tiaoz:function(){
		wx.switchTab({
			url: '../commodity/commodity'
		})
	},
	checkboxChange: function(e) {
		let that = this
		if(e.detail.value.length < that.data.shopping.length){
			that.setData({
				checked: false
			})
		}else{
			that.setData({
				checked: true
			})
		}
	},
	label:function(e){
		let that = this
		let index = e.currentTarget.dataset.id
		let num = that.data.num
		that.data.shopping[index].checked = !that.data.shopping[index].checked
		that.setData({
			shopping: that.data.shopping
		})
		
		if(that.data.shopping[index].checked){
			num = num + (that.data.shopping[index].price*that.data.shopping[index].shopNumber*1)
			num = Math.floor(num*100)/100
			that.setData({
				num: num
			})
		}else{
			num = num - (that.data.shopping[index].price*that.data.shopping[index].shopNumber*1)
			num = Math.floor(num*100)/100
			that.setData({
				num: num
			})
		}
	},
	addClick:function(e){
		let that = this
		let oid = e.currentTarget.dataset.id
		let num = this.data.shopping[oid].shopNumber
		let stock = this.data.shopping[oid].stock
		let onum = that.data.num
		num ++
		if(num > stock){
			this.data.shopping[oid].shopNumber = stock
			this.setData({
				shopping:this.data.shopping
			})
			wx.showToast({
				title: '库存容量不足',
				icon: 'none',
				duration: 1000
			})
		}else{
			let odata = {
				id:'',
				num:''
			}
			this.data.shopping[oid].shopNumber = num
			this.setData({
				shopping:this.data.shopping
			})
			if(that.data.shopping[oid].checked){
				onum = onum + (that.data.shopping[oid].price*1)
				onum =  Math.floor(onum*100)/100
				this.setData({
					num: onum
				})
			}
			odata.id = that.data.shopping[oid].c_id
			odata.num = that.data.shopping[oid].shopNumber
			request.request('shopping_cart_num','POST',odata).then(res => {
				wx.redirectTo({
					url: '../commodity/commodity'
				})
			})
			
		}
	},
	subClick:function(e){
		let that = this
		let oid = e.currentTarget.dataset.id
		let num = this.data.shopping[oid].shopNumber
		let onum = that.data.num
		num --
		if(num <= 0){
			this.data.shopping[oid].shopNumber = 1
			this.setData({
				shopping:this.data.shopping,
			})
			wx.showToast({
				title: '选择的商品数量至少为1',
				icon: 'none',
				duration: 1000
			})
		}else{
			let odata = {
				id:'',
				num:''
			}
			this.data.shopping[oid].shopNumber = num
			this.setData({
				shopping:this.data.shopping
			})
			if(that.data.shopping[oid].checked){
				onum = onum - (that.data.shopping[oid].price*1)
				onum = Math.floor(onum*100)/100
				this.setData({
					num: onum
				})
			}
			odata.id = that.data.shopping[oid].c_id
			odata.num = that.data.shopping[oid].shopNumber
			console.log(odata)
			
			request.request('shopping_cart_num','POST',odata).then(res => {
				wx.redirectTo({
					url: '../commodity/commodity'
				})
			})
		}
	},
	shopNum:function(e){
		let that = this
		let oid = e.currentTarget.dataset.id
		that.data.shopping[oid].shopNumber = e.detail.value
		let stock = that.data.shopping[oid].stock
		let onum = that.data.num
		if(e.detail.value < 0){
			that.data.shopping[oid].shopNumber = 1
			that.setData({
				shopping:that.data.shopping
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
			that.data.shopping[oid].shopNumber = e.detail.value
			that.setData({
				shopping:that.data.shopping
			})
		}else if(!/(^\d+$)/.test(e.detail.value)){
			that.data.shopping[oid].shopNumber = 1
			that.setData({
				shopping:that.data.shopping
			})
			wx.showToast({
				title: '请输入正整数',
				icon: 'none',
				duration: 1000
			})
		}else{
			that.data.shopping[oid].shopNumber = e.detail.value
			that.setData({
				shopping:that.data.shopping
			})
		}
		if(that.data.shopping[oid].checked){
			onum = 0
			for(let i = 0; i < that.data.shopping.length; i++){
				if(that.data.shopping[i].checked){
					onum = onum + (that.data.shopping[i].price*that.data.shopping[i].shopNumber*1)
					onum =  Math.floor(onum*100)/100
				}
				that.setData({
					shopping:that.data.shopping,
					num:onum
				})
			}
		}
	},
	
	buy:function(){
		let that = this
		let odata = []
		that.data.odata = []
		for(let i = 0; i < that.data.shopping.length; i++){
			if(that.data.shopping[i].checked){
				odata.push({
					id:that.data.shopping[i].id,
					price:that.data.shopping[i].price,
					num:that.data.shopping[i].shopNumber,
					status:1,
					shoping:2,
				})
			}
		}
		if(odata.length <= 0){
			wx.showToast({
				title: '请选择要结算的商品',
				icon: 'none',
				duration: 2000
			})
		}else{
			wx.removeStorage({
				key: 'oid'
			})
			wx.navigateTo({
				url: '../order/order',
				success: function(res) {
					res.eventChannel.emit('orderData', { data: odata})
				}
			})
		}
	},
	del:function(){
		let that = this
		const oid = []
		for(let i = that.data.shopping.length-1; i > -1; i--){
			if(that.data.shopping[i].checked){
				oid.push(that.data.shopping[i].id)
				that.data.shopping.splice(i,1)
			}
		}
		if(oid.length <= 0){
			wx.showToast({
				title: '请选择删除的商品',
				icon: 'none',
				duration: 2000
			})
		}else{
			request.request('del_cart_goods','POST',oid).then(res => {
				that.setData({
					shopping:that.data.shopping,
					num:0
				})
				if(that.data.shopping.length <= 0){
					that.setData({
						showHide:false
					})
				}
			})
		}
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