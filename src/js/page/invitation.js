// 引入css
require('../../css/lib/reset.css')
require('../../css/lib/swiper.min.css')
require('../../css/common/global.css')
require('../../css/common/grid.css')
require('../../css/page/invitation.less')
//引入js
var Swiper = require('swiper');
var md5 = require('md5');
var wxShare = require('wxShare');
var Check = require('check');
var Pay = require('pay');
var check = new Check();
var common = check.common;

var swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    paginationClickable: true,
    loop: true,
    autoplay : 3000,
    speed:300,
    lazyLoading : true,
    lazyLoadingInPrevNext : true,
});
var share = new wxShare();
share.start()
console.log('==========哈哈哈',wx)
var DEVICE  = common.isiOS ? "iOS" : "android";
var APPBUILD = 1100;
var APIVER = 1102;
var invCode = common.getUrlParam("invCode") ? common.getUrlParam("invCode") : "";
if(navigator.userAgent.indexOf('QQ') !== -1){
	var viewPortScale = 1 / window.devicePixelRatio;
	document.getElementById('viewport').setAttribute('content', 'user-scalable=no, width=device-width, initial-scale=' + viewPortScale);
}
//初始化
function init(){
	$(".loading_fra").show();  
	event();
}

//事件监听
function event(){
	window.onload = common.setFontHtml(375, close);
	window.onresize = common.setFontHtml(375, close);
	
	$("#DownLoad").on("click",function(){
		openApp();
	});

	$('.change').on('click',function(){
		config.productId = Math.ceil(Math.random()*100);
		pay.refresh({product_id:config.productId});
		console.log(config.productId)
	})

	//支付
	var token = "15467888";
	var userId = "1980";
	var pay = new Pay($('.pay'),{
		debug:false,
		data:{
			openid:'openid',
			product_id:1
		},
		beforeSend:function(request){
			request.setRequestHeader("os", DEVICE);
			request.setRequestHeader("ch", "wechat");
			request.setRequestHeader("appbuild", APPBUILD);
			request.setRequestHeader("token", token);
			request.setRequestHeader("uid", userId);
		},
		success:function(data){
			console.log('支付成功');
		},
		fail:function(data){
			console.log('支付失败');
		},
		error:function(data){
			console.log('网络出错');
		}
	})
	
}


//唤醒APP
function openApp(){
	if(common.isAndroid){
		common.wakeUpAPP("doll://laka/video_detail");
	}else if(common.isiOS){
		common.wakeUpAPP("//jump.apps.lakatv.com/index/zhuawawa");
	}else{
		common.wakeUpAPP("//jump.apps.lakatv.com/index/zhuawawa");
	}
}

//用户登录
function getUserLogin(code){
	$.ajax({
		url:config.apiHost + "login/wechat",
		type: "post",
		dataType: 'json',
		data: {
			code : code
		},
		beforeSend: function(request) {
			request.setRequestHeader("os", DEVICE);
			request.setRequestHeader("ch", "wechat");
			request.setRequestHeader("apiver", APIVER);
			request.setRequestHeader("appbuild", APPBUILD);
		},
		success:function(data){
			if(data.code == 0){
				uid = data.data.id;
				token = data.data.token;

				//如果有邀请码则绑定
				var invitedCode = data.data.invited_code;
				if(!invitedCode.replace(/(^\s*)|(\s*$)/g,'') && invCode){
					bindCode(invCode, uid, token);
				}
			}
		},
		error:function(data){
			
		}
	});
}

//绑定账号
function bindCode(code, uid, token){
	$.ajax({
		url:config.apiHost + "user/invitation/bind",
		type: "post",
		dataType: 'json',
		data: {
			invitation_code:code,
		},
		beforeSend: function(request) {
			request.setRequestHeader("token",token);
			request.setRequestHeader("uid",uid);
			request.setRequestHeader("os", DEVICE);
			request.setRequestHeader("ch", "wechat");
			request.setRequestHeader("apiver", APIVER);
			request.setRequestHeader("appbuild", APPBUILD);
		},
		success:function(data){
			if(data.code == 0){
				
			}
		},
		error:function(data){
			
		}
	});
}

function close(){
	$(".loading_fra").hide();
}

init(); 