define("jquery/jquery.scrollLoading",function(n){var o=n("jquery");o.fn.scrollLoading=function(n){var t={attr:"data-url",container:o(window),callback:o.noop},a=o.extend({},t,n||{});a.cache=[],o(this).each(function(){var n=this.nodeName.toLowerCase(),t=o(this).attr(a.attr),c={obj:o(this),tag:n,url:t};a.cache.push(c)});var c=function(n){o.isFunction(a.callback)&&a.callback.call(n.get(0))},i=function(){var n=a.container.height();contop=a.container.get(0)===window?o(window).scrollTop():a.container.offset().top,o.each(a.cache,function(o,t){var a,i,e=t.obj,r=t.tag,l=t.url;e&&(a=e.offset().top-contop,i=a+e.height(),(a>=0&&n>a||i>0&&n>=i)&&(l?"img"===r?c(e.attr("src",l)):e.load(l,{},function(){c(e)}):c(e),t.obj=null))})};i(),a.container.bind("scroll",i)}});