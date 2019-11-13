const ourl = 'https://shop.maohemao.com/mgr/index/'
let header = {
	'content-type': 'application/json',
	'openid': '',
	'sessionid': ''
}
// const header = 'application/x-www-form-urlencoded'//python后台
function login(){
	wx.login({
		success (even) {
			if (even.code) {
				request('get_xcx_user','POST',even.code).then(res => {
					console.log(res.data.msg)
					wx.setStorage({
						key:"sessionid",
						data:res.data.data,
					})
				})
			} else {
				console.log('登录失败！' + even.errMsg)
			}
		}
	})
}
wx.getSetting({
	success (res){
		if (res.authSetting['scope.userInfo']) {
			wx.getUserInfo({
				success: function(res) {
					request('save_user_info','POST',res.userInfo).then(res => {
						
					})
				}
			})
		}
	}
})
function request(url,method,data){
	wx.getStorage({
		key:'sessionid',
		success(e){
			header.openid = e.data.openid
			header.sessionid = e.data.sessionid
		}
	})
	let promise = new Promise((resolve,reject) => {
		wx.showLoading({
			title:'加载中'
		})
		wx.request({
			url: ourl + url,
			method:method,
			data:{
				datas:data
			},
			header: header,
			success: (res => {
				// console.log(header)
				wx.hideLoading();
				if (res.statusCode == 200) {
					resolve(res);
				}else {
					reject(res.data);
				}
			}),
			fail: (res => {
				wx.hideLoading();
				wx.showToast({
					title: '网络出错',
					icon: 'none',
					duration: 1500
				})
				reject('网络出错');
			})
		})
	})
	return promise;
}

module.exports = {
	request: request,
	login:login
}