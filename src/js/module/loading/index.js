/**
 * creacted by sue on 2017-12-18   2017-12-26
 */
module.exports = (function(){
    document.onreadystatechange = subSomething;//当页面加载状态改变的时候执行这个方法.
    $(window).on('scroll',function(){
        imgLoad();
    }) 
    function subSomething(){ 
        console.log('=============document.readyState========',document.readyState)
        if(document.readyState == "complete"){   //页面加载完成
        　　console.log('===========加载完成')
            $('.loading-wrap').remove();
            imgLoad();
        }
    };

    function imgLoad(){
        var imgLazy = $('.img-lazy');
        if(imgLazy.length>0){
            imgLazy.each(function(index,node){
                var scrollTop = getScrollTop();
                var clientHeight = document.documentElement.clientHeight ;
                var imgOffsetTop = $(node).offset().top;
                if((scrollTop+clientHeight)>=imgOffsetTop){   //当图片显示在可视区域时就加载
                    var dataSrc = $(node).attr('data-src');
                    $(node).attr('src',dataSrc)
                            .removeAttr('data-src')
                            .removeClass('img-lazy');
                }
            })
        }
    }

    function getScrollTop(){
        var scrollTop=0;
        if(document.documentElement&&document.documentElement.scrollTop){
            scrollTop=document.documentElement.scrollTop;
        }else if(document.body){
            scrollTop=document.body.scrollTop;
        }
        return scrollTop;
    }
    
})()

