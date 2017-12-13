/**
	* Created by sue on 2017/12/12.
	*
	* @param  payBtn     ：点击支付的按钮
	* @param  options    ：{}
	*         debug      ：Boolean 是否开启debug 
	* 		  data       ：object  支付提交的数据  (提交数据更新可调用pay.refresh()方法)
	*         beforeSend ：function 提交前要做的处理
	* 		  success    ：function 支付成功
	* 		  fail       ：function 支付失败or支付关闭
	* 		  error      ：function 其他特殊情况
*/
function Pay(payBtn,options) {
	//构造函数
	this.payBtn = payBtn;
	this.options = $.extend({
		debug:false,
		data:{},
		beforeSend:function(){},
		success:this.payResult,
		fail:this.payResult,
		error:this.payResult
	},options);
	
	this.init();
}


Pay.prototype = {
	constructor : Pay,
	/**
	 * 初始化
	 */
	init:function(){
		var self = this;
		self.getConfig();
		wx.ready(function() {
			self.wxPay();
		});
	},
	/**
	 * 更新提交数据
	 * @param data object 要修改的数据
	 */
	refresh:function(data){
		var self = this;
		self.options.data = $.extend(self.options.data,data);
	},
	/**
	 * 默认的结果处理
	 */
	payResult:function(res){
		alert(res);
	},
	/*
	 * 获取微信验证配置
	 * 
	 */
	getConfig:function(){
		var self = this;
		var wlocationHref = encodeURIComponent(window.location.href);
		$.ajax({
			type: "get",
			async: false,
			url: config.apiHost + config.payConfigApi,
			dataType: 'json',
			data: {
				url : wlocationHref
			},
			success: function(d) {
				var dobj = d.data;
				self.wxConfig(dobj);
			}
		});
	},
	/*
	 * 获取微信验证配置
	 * @param configData object 配置信息
	 *
	 */
	wxConfig:function(configData){
		var self = this;
		wx.config({
			debug: self.options.debug,
			appId: configData.appId,
			timestamp: configData.timestamp,
			nonceStr: configData.nonceStr,
			signature: configData.signature,
			jsApiList: ["chooseWXPay"]
		});
	},
	/**
	 * 微信支付方法
	 */
	wxPay:function(){
		var self = this;
		var payBtn = self.payBtn;
		var data = self.options.data;
		payBtn.on("click",function(){
			console.log(self.options.data);
			if($(this).hasClass('disable')){
				return;
			}
			$(this).addClass('disable');
			$.ajax({
				type: "post",
				async: false,
				url: config.apiHost + config.paySubmitApi, 
				dataType: 'json',
				data: data,
				beforeSend: function(request) {
					self.options.beforeSend(request);
				},
				success: function(d) {
					var dobj = d.data;
					var appId = dobj.appId;
					var nonceStr = dobj.sign;
					var timestamp = dobj.timeStamp;
					var signature = dobj.signature;
					payBtn.removeClass("disable");
					wx.chooseWXPay({
						timestamp: dobj.timeStamp,
						nonceStr: dobj.nonceStr,
						package: dobj.package,
						signType: dobj.signType,
						paySign: dobj.sign,
						success: function(res) {
							if(res.errMsg == "chooseWXPay:ok") {
								self.options.success(res);
							} else if(res.errMsg == "chooseWXPay:cancel" || res.errMsg == "chooseWXPay:fail") {
								self.options.fail(res);
							} else {
								self.options.error(res);
							}
						}
					});
				}
			});
		});
	}
}

module.exports = Pay;