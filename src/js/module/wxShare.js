/**
 * created by web on 2017/12/04
 */

//加载公共模块
var common = require('./common.js');
function WxShare(){}

WxShare.prototype={
    constructor : WxShare ,
    start:function(){
        this.getData();
    },
    getData:function(){
        var self = this;
        var wlocationHref = encodeURIComponent(window.location.href);
		$.ajax({
			type: "get",
			async: false,
			url: config.apiHost+"wechat/js/api/sign",
			dataType: 'json',
			data: {
				url : wlocationHref
			},
			success: function(d) {
				var dobj = d.data;
				var appId = dobj.appId;
				var nonceStr = dobj.nonceStr;
				var timestamp = dobj.timestamp;
				var signature = dobj.signature;
				if(common.checkWeiXin()){
					self.weixin_share(appId, nonceStr, timestamp, signature);
				}else{
					self.qq_share(appId, nonceStr, timestamp, signature);
				}
			}
		});
    },
    qq_share:function(appId, nonceStr, timestamp, signature){
        var share_title = config.wxTitle;
        var share_desc = config.wxDescribe || share_title;
        var share_img = config.bannerImg;
        var share_link = location.href;
        setShareInfo({
            title: share_title,
            summary: share_desc,
            pic: share_img,
            url: share_link,
            WXconfig: {
                swapTitleInWX: true,
                appId: appId,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature
            }
        });
    },
    weixin_share:function(appId, nonceStr, timestamp, signature){
        var share_title = config.wxTitle;
        var share_desc = config.wxDescribe || share_title;
        var share_img = config.bannerImg;
        var share_link = location.href;
        wx.config({
            debug: false,
            appId: appId,
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'getNetworkType'
            ]
        });
        wx.ready(function() {
            wx.getNetworkType({
                success: function(res) {
                    if(res.networkType == 'wifi') {
                        //$('#play-control').click();
                    }
                },
                fail: function(res) {}
            });
            wx.onMenuShareAppMessage({
                title: share_title,
                desc: share_desc,
                link: share_link,
                imgUrl: share_img,
                trigger: function(res) {},
                success: function(res) {},
                cancel: function(res) {},
                fail: function(res) {}
            });

            wx.onMenuShareTimeline({
                title: share_desc,
                link: share_link,
                imgUrl: share_img,
                trigger: function(res) {},
                success: function(res) {},
                cancel: function(res) {},
                fail: function(res) {}
            });

            wx.onMenuShareQQ({
                title: share_title,
                desc: share_desc,
                link: share_link,
                imgUrl: share_img,
                trigger: function(res) {},
                success: function(res) {},
                cancel: function(res) {},
                fail: function(res) {}
            });

            wx.onMenuShareWeibo({
                title: share_title,
                desc: share_desc,
                link: share_link,
                imgUrl: share_img,
                trigger: function(res) {},
                success: function(res) {},
                cancel: function(res) {},
                fail: function(res) {}
            });
        });
    }
}

module.exports = WxShare;