// 引入css
require('../../css/lib/reset.css')
require('../../css/common/global.css')
require('../../css/common/grid.css')
require('../../css/page/index.less')

var Check = require('../module/check.js');
var Pay = require('../module/pay.js');
var check = new Check();
var common = check.common;


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