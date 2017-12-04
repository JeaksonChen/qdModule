/**
 * Created by web on 2017/10/18.
 */
var common = {
    /**
	 *
	 *获取URL的参数
	 *
	 *@param {string}  name  参数键名
	 *
	 *@return {string} 参数值
	 */
	getUrlParam: function(name){
		var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)"); 
		var r =  window.location.search.substr(1).match(reg);
		var strValue = "";
		if (r!=null){
		 strValue= unescape(r[2]);
		}
		return strValue;
	},
	/**
	 *
	 *获取URL的协议（只适合http和https）
	 *
	 *@param {string}  url  链接地址
	 *
	 *@return {string} url的协议
	 */
	checkedProtocol : function(url){
		return url.match(/(https|http)/g)[0];
	},
	/**
	 *
	 *对比前后版本（只适合http和https）
	 *
	 *@param {string} rela       对比符号（只支持">","<","="）
	 *@param {string} verFirst   版本号
	 *@param {string} verSecond  版本号
	 *
	 @return {boolean}
	 */
	comparVersion : function(rela, verFirst, verSecond){
		verFirst  = verFirst.replace(/[.]/g, "");
		verSecond = verSecond.replace(/[.]/g, "");
		switch(rela){
			case ">":
				if(verFirst>verSecond){
					return true;
				}else{
					return false;
				}
				break;
			case "<":
				if(verFirst<verSecond){
					return true;
				}else{
					return false;
				}
				break;
			case "=":
				if(verFirst=verSecond){
					return true;
				}else{
					return false;
				}
				break;
			default:
				console.log("the first param err");
				return false;
				break;
		}
	}
}

module.exports = common;