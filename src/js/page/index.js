// 引入css
require('../../css/lib/reset.css')
require('../../css/common/global.css')
require('../../css/common/grid.css')
require('../../css/page/index.less')

var config = require('../../../conf/conf.js');

/* eslint-disable no-undef */
$('.g-bd').append('<p class="text">这是由js生成的一句话。' + config.test + '</p>');

// 增加事件
$('.btn').click(function () {
    require.ensure(['../components/dialog/index.js'], function (require) {
        var Dialog = require('../components/dialog/index.js')
        new Dialog()
    })
})

//图片增加事件
$(".g-bd .img").click(function () {
    location.href = "./list.html";
})