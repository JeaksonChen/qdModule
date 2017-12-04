// 引入css
require('../../css/lib/reset.css')
require('../../css/common/global.css')
require('../../css/common/grid.css')
require('../../css/page/index.less')

var Pay = require('../module/pay.js');
var pay = new Pay();
var common = pay.common;

var version = common.getUrlParam("version");
var protocol = common.checkedProtocol(window.location.href);
console.log(version);
console.log(curVersion);
console.log(protocol);
console.log(common.comparVersion(">","2.8.3","2.8.2"));


/* eslint-disable no-undef */
$('.g-bd').append('<p class="text">这是由js生成的一句话。-----'+common.DateTime+ '</p>');

// 增加事件
$('.btn').click(function () {
    require.ensure(['../module/dialog/index.js'], function (require) {
        var Dialog = require('../module/dialog/index.js')
        new Dialog()
    })
})

//图片增加事件
$(".g-bd .img").click(function () {
    location.href = "./list.html";
})