/**
 * Created by web on 2017/12/04.
 * auto:chenyuesen
 *
 * 检测模块
 */
var common = require('./common.js');

function Check() {
	//构造函数
	this.protocol = common.checkedProtocol(window.location.href);
	this.init();
}


Check.prototype = {
	constructor : Check,
	common : common,
	init : function(){
		console.log("初始化");
		console.log(this.protocol);
	},
}

module.exports = Check;